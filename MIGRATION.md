# Migration

Both repos were verified byte-identical to what's served, so the line numbers below
are real.

| Repo | Serves | Stylesheet | Raw hex left | Sizes |
|---|---|---|---|---|
| `rokmr/rokmr.github.io` | rohit.vision | `main.css` (1522 lines) | 35 lines | 68 hardcoded rem, 17 distinct |
| `rohitronie/blogs` | blogs.rohit.vision | `assets/css/main.css` (4635 lines) | 115 lines | 0 px — already all rem |

The design is **drop-in**. The alias block at the bottom of `tokens.css` re-points
every token both repos already use, so nothing breaks on day one and you can
migrate component CSS at your own pace.

One change is visible immediately and on purpose — see [Measure](#measure) at the
bottom.

---

## Step 1 — copy the files

Same three files into both repos.

**Portfolio** (`rokmr/rokmr.github.io`) — repo root, beside the existing `main.css`:

```
tokens.css
base.css
viz.css
```

**Blog** (`rohitronie/blogs`) — into `assets/css/`:

```
assets/css/tokens.css
assets/css/base.css
assets/css/viz.css
```

---

## Step 2 — link them before the existing stylesheet

Order matters. `tokens.css` must come first, and the existing `main.css` must come
last so it can still win where it hasn't been migrated yet.

**Portfolio** — `index.html`, at line 256, replace:

```html
<link rel="stylesheet" href="main.css">
```

with:

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="base.css">
<link rel="stylesheet" href="viz.css">
<link rel="stylesheet" href="main.css">
```

**Blog** — `_layouts/default.html`, at lines 40–41, replace:

```html
<link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/slide-viewer.css' | relative_url }}">
```

with:

```html
<link rel="stylesheet" href="{{ '/assets/css/tokens.css'  | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/base.css'    | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/viz.css'     | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/main.css'    | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/slide-viewer.css' | relative_url }}">
```

Keep the CDN links (KaTeX, Prism, CodeMirror) above these — they're third-party and
shouldn't be overridden by the token layer.

---

## Step 3 — delete the old `:root` blocks

Both repos declare their own tokens, which will now shadow the new ones. Remove:

- **Portfolio** — `main.css` lines **1–11** (the 9-token `:root`).
- **Blog** — `assets/css/main.css` lines **13–158** (the large `:root`, from
  `--bg` through `--highlight-border`).

Everything in those blocks is reproduced in `tokens.css`, either under its own name
or as an alias.

At this point both sites should render essentially unchanged, with three fixes
applied automatically:

| Fix | Where it lands | Count |
|---|---|---|
| `--dim` `#666666` → `#888888` (3.45:1 → 5.58:1, now passes AA) | blog nav, meta, captions | **63 usages** |
| `--text-xs` `0.65rem` → `0.75rem` (10.4px → 12px floor) | blog badges, tags, ticks | **33 usages** |
| `--border-control` now available at 3.45:1 | any focusable control | — |

---

## Step 4 — migrate component CSS (incremental, optional)

Nothing forces this. Work through it when you touch a component.

### Token map — old → new

**Colour**

| Old | New |
|---|---|
| `--bg` | `--surface` |
| `--bg-card` | `--surface-card` |
| `--bg-elevated` | `--surface-raised` |
| `--eq-bg` | `--surface-inset` |
| `--text` | `--ink` |
| `--text-secondary` | `--ink-secondary` |
| `--dim` | `--ink-muted` |
| `--accent` | `--ink-accent` |
| `--border` | `--border` *(unchanged — hairline)* |
| `--border-hover` | `--border-strong` |
| — | `--border-control` *(new — use on inputs)* |

**Callouts** — `--tip-*` → `--status-good*`, `--note-*` → `--status-info*`,
`--warning-*` → `--status-warning*`, `--danger-*` → `--status-critical*`,
`--question-*` → `--status-note*`.

**Charts** — note slots 3 and 4 swap meaning:

| Old | New | Was |
|---|---|---|
| `--graph-line-1` | `--series-1` | green — unchanged |
| `--graph-line-2` | `--series-2` | blue — unchanged |
| `--graph-line-3` | `--series-5` | pink moved to slot 5 |
| `--graph-line-4` | `--series-3` | orange moved to slot 3 |
| `--graph-grid` | `--viz-grid` | |
| `--graph-axis` | `--viz-axis` | |
| `--graph-fill` | `--viz-fill` | |

Pink and orange moved because the slot order is a CVD-safety mechanism, not a
preference. Existing 3- and 4-series plots keep working through the aliases; new
plots should use `--series-N` in order.

**Spacing** — nine families collapse into one scale:

| Old | New |
|---|---|
| `--spacing-horizontal` | `--gutter` |
| `--card-padding`, `--card-gap`, `--card-margin-bottom` | `--card-pad` |
| `--paragraph-margin` | `--flow` |
| `--content-element-margin` | `--space-6` |
| `--heading-margin-top` | `--space-7` |
| `--heading-margin-bottom` | `--flow` |
| `--section-margin-top` | `--section-gap` |
| `--section-margin-bottom` | `--space-7` |
| `--footer-margin-top` | `--space-9` |
| `--spacing-vertical-top` | `calc(var(--header-h) + var(--space-8))` |

**Type** — `--font-size-base` → `--text-md`, `--line-height` → `--leading-normal`.
The `--text-*` step names are unchanged; only `xs` and `sm` shifted, both upward.

### Portfolio-specific: the 17 hardcoded sizes

The portfolio has 68 `font-size` declarations across 17 distinct rem values,
including four below the new floor. Map them:

| Old | New | Note |
|---|---|---|
| `0.45rem` (7.2px) | `--text-xs` | **was unreadable** |
| `0.55rem` (8.8px) | `--text-xs` | **was unreadable** |
| `0.6rem` (9.6px) | `--text-xs` | **was unreadable** |
| `0.65rem` (10.4px) | `--text-xs` | below floor |
| `0.7rem` (11.2px) | `--text-sm` | below floor |
| `0.75rem` | `--text-sm` | |
| `0.8rem` | `--text-base` | |
| `0.85rem` | `--text-base` | |
| `0.9rem` / `0.95rem` | `--text-md` | |
| `1rem` | `--text-md` | |
| `1.1rem` | `--text-lg` | |
| `1.2rem` | `--text-xl` | |
| `1.5rem` | `--text-2xl` | |
| `1.6rem` | `--text-2xl` | |
| `2rem` | `--text-3xl` | |
| `clamp(2rem, 3.5vw, 2.8rem)` | `--text-4xl` | keep the clamp if you want fluid hero |

Also worth doing while you're in there: the portfolio has no `.prose` context, so
its body copy doesn't get the reading size or measure. Wrap the About and
Experience prose in `.prose` to pick both up.

---

## Step 5 — drop the alias block

Once neither repo references an old token name, delete the final `BACK-COMPAT
ALIASES` block in `tokens.css`. Check with:

```bash
grep -rnE 'var\(--(bg|bg-card|bg-elevated|text|text-secondary|dim|accent|border-hover|graph-line-[0-9]|tip-|note-|warning-|danger-|question-|spacing-|card-padding|card-gap|paragraph-margin|section-margin|footer-margin|font-size-base|line-height)\)' \
  --include='*.css' --include='*.html' .
```

Empty output means the block is safe to remove.

---

## Measure

This is the one change that visibly alters existing layout.

Prose columns move from a fixed **900px** to **`68ch`** (~640px at 17px). The old
column ran to roughly 105 characters per line; comfortable reading is 45–75.

It's the highest-impact readability fix in the set, which is why it's the default.
To keep the wider column, set one token in `tokens.css`:

```css
--measure: 105ch;   /* restores the previous line length */
```

Nothing else depends on it.

---

## Verify

```bash
# from the design-system folder
open preview/index.html          # every token and component, with measured ratios
```

Then on each site, check in this order: a post (reading size and measure), the
notes index (grid and cards), a plot-heavy post (series colours and legends), a
form or the search page (`--border-control` on inputs), and finally
**print preview** — that's where the light mode and the validated-on-white series
palette earn their keep.
