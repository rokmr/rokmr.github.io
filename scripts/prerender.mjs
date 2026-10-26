// Renders every route to static HTML after the client and SSR bundles are built.
//
//   dist/            client bundle + index.html shell (from `vite build`)
//   dist-ssr/        Node bundle exporting renderAll() (from `vite build --ssr`)
//
// Each route's markup, <head> and body class are injected into the shell and
// written to its own index.html, so GitHub Pages can serve them as static files.

import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const distDir = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');
const shellPath = join(distDir, 'index.html');

const { renderAll, agentProfileMarkdown, publicAgentProfile } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

const shell = await readFile(shellPath, 'utf8');

for (const marker of ['<!--app-head-->', '<!--app-html-->', '%BUILD_YEAR%']) {
  if (!shell.includes(marker)) {
    throw new Error(`index.html is missing the ${marker} placeholder`);
  }
}

const pages = renderAll();

for (const page of pages) {
  let html = shell
    .replace('<!--app-head-->', page.head)
    .replace('<!--app-html-->', page.html)
    .replace('%BUILD_YEAR%', String(page.buildYear));

  if (page.bodyClass) {
    html = html.replace('<body>', `<body class="${page.bodyClass}">`);
  }

  const outPath = join(distDir, page.file);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, 'utf8');
  console.log(`prerendered ${page.route} → dist/${page.file}`);
}

// Build the sitemap from the same route set as the emitted HTML.
const canonicalUrls = pages.map(page => {
  const match = page.head.match(/<link rel="canonical" href="([^"]+)"/);
  if (!match) throw new Error(`Missing canonical URL for ${page.route}`);
  return match[1];
});
await writeFile(join(distDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicalUrls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`, 'utf8');

// Agent discovery is generated from reviewed public content only.
await writeFile(join(distDir, 'llms.txt'), agentProfileMarkdown, 'utf8');
await writeFile(join(distDir, 'profile.json'), JSON.stringify(publicAgentProfile, null, 2) + '\n', 'utf8');

// The SSR bundle is a build artefact, not something to deploy.
await rm(ssrDir, { recursive: true, force: true });
