# rohit.vision

Personal site for Rohit Kumar — portfolio at `/` and the TACLE paper page at `/tacle/`.

Built with **Vite + React + TypeScript**, prerendered to static HTML at build time
and deployed to GitHub Pages. No client-side router and no server: each route is
a real `index.html` that hydrates into React.

## Commands

| Command | What it does |
|---|---|
| `make install` / `npm install` | Install dependencies |
| `make dev` / `npm run dev` | Dev server with hot reload on :8000 |
| `make build` / `npm run build` | Build + prerender into `dist/` |
| `make serve` | Build, then serve `dist/` on :8000 — the real deployed output |
| `make typecheck` | `tsc --noEmit` |
| `make test` / `npm test` | Unit tests (Vitest) for `lib/flow` and the page data |
| `make clean` | Remove build output and `.DS_Store` files |

## Layout

```
index.html              Vite shell; holds the <!--app-head--> / <!--app-html--> slots
src/
  entry-client.tsx      Hydrates the prerendered markup
  entry-server.tsx      renderAll() — used only at build time
  App.tsx               Route table (two routes, no router library)
  pages/                Home, Tacle
  components/           Header, Footer, HeroFigure, Icon, section components
  hooks/                Flow figure binding, page scroll (header state, current section),
                        noise reveal, mobile nav, section reveal, citations
  lib/flow/             Hero "Figure 1": flow-matching particle figure (framework-agnostic)
    controller.ts         Mounts on a canvas: loop, sizing, visibility, pointer input
    gl.ts                 WebGL2 sample layer (one draw call; 2-D fallback in render.ts)
    render.ts             2-D layers: rings, arrows, labels (and samples without WebGL2)
    geometry.ts           Layout (side by side / stacked), pointer → t
    particles.ts          Noise/data pairs in a flat Float32Array
    targets.ts            p_data: image stippling and 2-D toy distributions
    timeline.ts           Autoplay schedule
  data/                 All page content as typed data
  seo/                  Per-route <head> and JSON-LD
  styles/               tokens → base (incl. .l-margin, .card-grid) → viz → main →
                        components/ (meta, pill, tag, sections) → tacle → responsive
scripts/prerender.mjs   Renders each route into dist/<route>/index.html
public/                 Served verbatim: assets, CNAME, robots.txt, sitemap.xml, 404.html
legacy/                 Pre-migration originals, kept for reference. Safe to delete.
```

### Adding content

Content lives in `src/data/` — adding a project, publication, job or certificate
is a data edit, not a markup edit:

```ts
// src/data/projects.ts
{
  title: 'New Project',
  preview: { src: 'assets/images/foo.png', alt: '…', width: 1024, height: 576 },
  links: [{ href: '…', icon: 'github', title: 'GitHub', ariaLabel: '…' }],
  description: '…',
  tech: ['PyTorch'],
}
```

Icons are centralised in `src/components/Icon.tsx`; add a path there and reference
it by name.

### Styles

The cascade order in `src/styles/index.css` is load-bearing:

1. `tokens.css` — design tokens (the only place raw values belong)
2. `base.css`, `viz.css` — element and chart defaults
3. `main.css` — portfolio components (still being migrated onto tokens)
4. `tacle.css` — the TACLE page, scoped under `.tacle-page`
5. `responsive.css` — the breakpoint ladder, last so it wins

`responsive.css` documents the breakpoints. Navigation switches to the drawer at
≤900px; content grids have their own separate rungs so tablets keep multi-column
layouts.

## Deployment

`.github/workflows/deploy.yml` builds and publishes `dist/` on every push to
`main`.

> **One-time setup:** in **Settings → Pages → Build and deployment**, set
> **Source** to **GitHub Actions**. Until that is changed, Pages keeps serving
> the old branch contents and deployments will not go live.

The custom domain comes from `public/CNAME`, which the build copies into `dist/`;
the workflow fails if it is missing.

## Master career content

The [content foundation](content/README.md) separates a local detailed master,
reviewed public content, and future website/SEO/résumé outputs. Start there when
adding career facts or new Armada contributions. This is a staged migration;
`src/data/` still supplies the live portfolio until its adapters are migrated.
