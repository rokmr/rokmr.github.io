import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPublicProfile, validateMaster } from './content.mjs';

const schema = JSON.parse(await readFile(new URL('../content/master.schema.json', import.meta.url)));
const template = JSON.parse(await readFile(new URL('../content/master.template.json', import.meta.url)));
const fixture = () => structuredClone(template);

test('the checked-in template is valid without a local private master', () => {
  assert.equal(validateMaster(fixture(), schema).schemaVersion, 1);
});

test('public projection excludes private fields even on selected public records', () => {
  const master = fixture();
  master.person.private.notes.push('PERSON_PRIVATE_SENTINEL');
  master.inbox.push('INBOX_PRIVATE_SENTINEL');
  master.records[0].privateNotes.push('RECORD_PRIVATE_SENTINEL');
  master.records[0].sources.push({ type: 'user-notes', reference: 'SOURCE_PRIVATE_SENTINEL', asOf: null });
  const output = JSON.stringify(buildPublicProfile(master, schema));
  assert.doesNotMatch(output, /PRIVATE_SENTINEL/);
  assert.equal(JSON.parse(output).records.length, 3);
});

test('a website selection cannot publish a private or unreviewed record', () => {
  for (const visibility of ['private', 'needs-review']) {
    const master = fixture();
    master.records[0].visibility = visibility;
    assert.throws(() => buildPublicProfile(master, schema), /not public/);
  }
});

test('a public record cannot expose private metrics', () => {
  const master = fixture();
  master.records[0].metrics.push({
    id: 'private-benchmark', label: 'METRIC_PRIVATE_SENTINEL', value: 1, unit: null,
    baseline: null, sample: null, asOf: null, context: 'Internal', limitations: [],
    visibility: 'private', sources: [],
  });
  assert.doesNotMatch(JSON.stringify(buildPublicProfile(master, schema)), /METRIC_PRIVATE_SENTINEL/);
  master.records[0].metrics[0].visibility = 'public';
  assert.throws(() => validateMaster(master, schema), /public metrics need/);
});

test('IDs, references, and hierarchy stay consistent', () => {
  let master = fixture();
  master.records.push(structuredClone(master.records[0]));
  assert.throws(() => validateMaster(master, schema), /duplicate record ID/);
  master = fixture();
  master.records[0].relatedIds.push('missing');
  assert.throws(() => validateMaster(master, schema), /unknown reference/);
  master = fixture();
  master.records[0].parentId = master.records[1].id;
  master.records[1].parentId = master.records[0].id;
  assert.throws(() => validateMaster(master, schema), /parent cycle/);
  master = fixture();
  master.views.resumes[0].recordIds.push('missing');
  assert.throws(() => validateMaster(master, schema), /unknown reference/);
});

test('chronology rejects invented end dates and invalid calendar dates', () => {
  let master = fixture();
  master.records[0].dates.end = '2026-09';
  assert.throws(() => validateMaster(master, schema), /ongoing work/);
  master = fixture();
  master.records[1].dates.start = '2026-02-30';
  assert.throws(() => validateMaster(master, schema), /invalid calendar date/);
  master = fixture();
  master.records[1].dates.end = '2023-01';
  assert.throws(() => validateMaster(master, schema), /end precedes start/);
});

test('unknown fields fail rather than silently disappearing from the schema', () => {
  const master = fixture();
  master.records[0].untrackedClaim = 'oops';
  assert.throws(() => validateMaster(master, schema), /unknown field/);
});

test('curated views cannot repeat a record', () => {
  const master = fixture();
  master.views.website.recordIds.push(master.views.website.recordIds[0]);
  assert.throws(() => validateMaster(master, schema), /duplicate record selection/);
});
