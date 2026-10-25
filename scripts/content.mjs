import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const masterPath = resolve(root, 'content/private/master.json');
const templatePath = resolve(root, 'content/master.template.json');
const schemaPath = resolve(root, 'content/master.schema.json');
const outputPath = resolve(root, 'content/generated/public-profile.json');

/** Small validator for the JSON Schema keywords used by master.schema.json.
 * This is deliberately not a general-purpose JSON Schema implementation. */
export function validateMaster(master, schema) {
  const fail = (path, message) => { throw new Error(`${path}: ${message}`); };
  const walk = (value, rule, path) => {
    if (rule.$ref) return walk(value, schema.$defs[rule.$ref.split('/').pop()], path);
    if ('const' in rule && value !== rule.const) fail(path, 'unsupported schema version');
    if (rule.enum && !rule.enum.includes(value)) fail(path, 'invalid choice');
    const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    if (rule.type && ![].concat(rule.type).includes(type)) fail(path, `expected ${[].concat(rule.type).join(' or ')}`);
    if (type === 'string' && rule.pattern && !new RegExp(rule.pattern).test(value)) fail(path, 'invalid format');
    if (type === 'number' && !Number.isFinite(value)) fail(path, 'expected a finite number');
    if (type === 'object') {
      for (const key of rule.required ?? []) if (!(key in value)) fail(path, `missing ${key}`);
      for (const [key, child] of Object.entries(value)) {
        if (rule.additionalProperties === false && !(key in (rule.properties ?? {}))) fail(path, `unknown field ${key}`);
        if (rule.properties?.[key]) walk(child, rule.properties[key], `${path}.${key}`);
      }
    }
    if (type === 'array' && rule.items) value.forEach((item, i) => walk(item, rule.items, `${path}[${i}]`));
  };
  walk(master, schema, 'master');
  const byId = new Map();
  for (const record of master.records) {
    if (byId.has(record.id)) fail(record.id, 'duplicate record ID');
    byId.set(record.id, record);
    const { start, end } = record.dates;
    for (const date of [start, end, ...record.metrics.map((metric) => metric.asOf), ...record.sources.map((source) => source.asOf)]) {
      if (date?.length === 10 && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) fail(record.id, 'invalid calendar date');
    }
    if (start && end && start.padEnd(10, '0') > end.padEnd(10, '9')) fail(record.id, 'end precedes start');
    if (record.status === 'ongoing' && end !== null) fail(record.id, 'ongoing work cannot have an end date');
    const metricIds = new Set();
    for (const metric of record.metrics) {
      if (metricIds.has(metric.id)) fail(record.id, 'duplicate metric ID');
      metricIds.add(metric.id);
      if (metric.visibility === 'public' && (metric.value === null || !metric.context.trim() || !metric.sources.length)) fail(record.id, 'public metrics need a value, context, and a source');
    }
  }
  for (const record of master.records) {
    for (const id of [record.parentId, ...record.relatedIds].filter(Boolean)) if (!byId.has(id)) fail(record.id, `unknown reference ${id}`);
    const seen = new Set([record.id]);
    let parent = record.parentId;
    while (parent) {
      if (seen.has(parent)) fail(record.id, 'parent cycle');
      seen.add(parent);
      parent = byId.get(parent).parentId;
    }
  }
  const website = master.views.website;
  const selections = [website.recordIds, website.featuredWorkIds, ...master.views.resumes.map((view) => view.recordIds)];
  for (const ids of selections) if (new Set(ids).size !== ids.length) fail('views', 'duplicate record selection');
  for (const id of website.recordIds) {
    const record = byId.get(id);
    if (!record || record.visibility !== 'public') fail('website', `record ${id} is missing or not public`);
    if (record.parentId && !website.recordIds.includes(record.parentId)) fail('website', `${id} needs its public parent in the view`);
  }
  for (const id of website.featuredWorkIds) {
    if (!website.recordIds.includes(id) || !['project', 'publication'].includes(byId.get(id).kind)) fail('website', `invalid featured work ${id}`);
  }
  const viewIds = new Set();
  for (const view of master.views.resumes) {
    if (viewIds.has(view.id)) fail('resumes', 'duplicate view ID');
    viewIds.add(view.id);
    for (const id of view.recordIds) if (!byId.has(id)) fail(view.id, `unknown reference ${id}`);
  }
  return master;
}

/** Explicit projection: private notes, inbox, sources, resume selections and
 * target preferences never enter this object, even on a public record. */
export function buildPublicProfile(master, schema) {
  validateMaster(master, schema);
  const { id, name, email, siteUrl, profiles } = master.person;
  const selected = new Set(master.views.website.recordIds);
  return {
    schemaVersion: master.schemaVersion,
    person: { id, name, email, siteUrl, profiles },
    featuredWorkIds: [...master.views.website.featuredWorkIds],
    records: master.records.filter((record) => selected.has(record.id)).map((record) => ({
      id: record.id, kind: record.kind, title: record.title, organization: record.organization,
      parentId: record.parentId, relatedIds: record.relatedIds.filter((id) => selected.has(id)),
      dates: record.dates, status: record.status, ownership: record.ownership,
      content: record.publicContent, technologies: record.technologies, links: record.links,
      metrics: record.metrics.filter((metric) => metric.visibility === 'public').map((metric) => ({
        id: metric.id, label: metric.label, value: metric.value, unit: metric.unit,
        baseline: metric.baseline, sample: metric.sample, asOf: metric.asOf,
        context: metric.context, limitations: metric.limitations,
      })),
    })),
  };
}

async function main() {
  const command = process.argv[2];
  if (command === 'init') {
    await mkdir(dirname(masterPath), { recursive: true });
    const seed = JSON.parse(await readFile(templatePath, 'utf8'));
    seed.$schema = '../master.schema.json';
    await writeFile(masterPath, `${JSON.stringify(seed, null, 2)}\n`, { flag: 'wx' });
    console.log('Created content/private/master.json. Existing masters are never overwritten.');
    return;
  }
  const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
  let input = masterPath;
  if (command === 'check') {
    try { await access(masterPath); } catch { input = templatePath; }
  }
  const master = JSON.parse(await readFile(input, 'utf8'));
  validateMaster(master, schema);
  if (command === 'check') {
    console.log(`Validated ${input === masterPath ? 'local master' : 'template (no local master)'}: ${master.records.length} records.`);
  } else if (command === 'export') {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(buildPublicProfile(master, schema), null, 2)}\n`);
    console.log('Wrote content/generated/public-profile.json. Website adapters consume the selected public fields.');
  } else {
    throw new Error('Usage: node scripts/content.mjs init|check|export');
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
