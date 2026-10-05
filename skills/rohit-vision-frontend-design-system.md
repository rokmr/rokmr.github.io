# rohit.vision — Frontend Design System Skill

> Reference skill for replicating the design language, tone, colors, typography, layout, components, and interactions used on [rohit.vision](https://rohit.vision) (rokmr.github.io).

---

## 1. Design Philosophy

- **Aesthetic:** Dark, monospaced, minimal, technical — resembles an ML training dashboard
- **Tone:** Professional yet personal; "research engineer who ships production code"
- **Principle:** No decoration for decoration's sake — every element is functional or metaphorical
- **Mode:** Dark mode only — no light theme toggle
- **Feel:** Terminal meets portfolio — JetBrains Mono everywhere technical, Inter for narrative

---

## 2. Color Palette

### CSS Custom Properties

```css
:root {
    --bg:             #0a0a0a;   /* Page background (near-black) */
    --bg-card:        #111111;   /* Cards, elevated surfaces */
    --bg-elevated:    #161616;   /* Tags, secondary surfaces, code blocks */
    --text:           #e8e8e8;   /* Primary text (soft white, not pure #fff) */
    --text-secondary: #999999;   /* Body copy, descriptions */
    --dim:            #888888;   /* Labels, metadata, muted text */
    --border:         #222222;   /* Default borders */
    --border-hover:   #444444;   /* Hover-state borders */
    --accent:         #4ade80;   /* Green accent — CTAs, section numbers, active states */
}
```

### Color Usage Rules

| Color | When to use |
|---|---|
| `--bg` (#0a0a0a) | Page background, canvas fill |
| `--bg-card` (#111111) | Card backgrounds, timeline items, social links |
| `--bg-elevated` (#161616) | Tech tags, pill backgrounds, nested surfaces |
| `--text` (#e8e8e8) | Headings, primary body text, strong emphasis |
| `--text-secondary` (#999999) | Paragraphs, descriptions, secondary info |
| `--dim` (#888888) | Labels, dates, locations, muted metadata |
| `--border` (#222222) | All default borders (cards, sections, header) |
| `--border-hover` (#444444) | Hover states on borders |
| `--accent` (#4ade80) | Section numbers, venue names, "currently reading" highlights, active timeline dots, skill category headings, achievement links, figure rays and time marker, slider |
| `#fff` / `#000` | Primary buttons only (white bg / black text). Also used for hover-state text |
| `rgba(74,222,128,α)` | Accent green with transparency (figure rays, overlays) |

### Gradient (footer badge only)

```css
background: linear-gradient(90deg, #4ade80, #60a5fa);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Surface Elevation Hierarchy

```
#0a0a0a (--bg)           ← Page background
  └─ #111111 (--bg-card)     ← Cards, timeline items
       └─ #161616 (--bg-elevated)  ← Tags, pills inside cards
```

---

## 3. Typography

### Font Stack

```css
/* Load from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap');

/* Monospace — technical elements */
font-family: 'JetBrains Mono', monospace;

/* Sans-serif — narrative content */
font-family: 'Inter', sans-serif;
```

### Font Assignment Rules

| Element | Font | Weight | Size | Extra |
|---|---|---|---|---|
| **Body default** | Inter | 400 | — | `line-height: 1.6` |
| **Hero title** | Inter | 700 | `clamp(2rem, 8cqi, 3.75rem)` — sized to its column (container query) | `line-height: 1.08`, `letter-spacing: -0.03em` |
| **Hero dek** | Inter | 400 | `--text-lg` | Color: `--ink-secondary`, `max-width: var(--measure)` |
| **Byline label** | JetBrains Mono | 400 | `--text-xs` | Uppercase, `--tracking-label`, color: `--ink-muted` |
| **Section H2** | Inter | 700 (default) | `1.5rem` | — |
| **Card title H3** | Inter | 600 | `1.1rem`–`1.2rem` | — |
| **Body paragraphs** | Inter | 400 | `0.85rem`–`0.95rem` | `line-height: 1.6`–`1.7` |
| **Logo** | JetBrains Mono | 600 | `0.8rem` | `letter-spacing: 2px`, uppercase vibe |
| **Nav links** | JetBrains Mono | 400 | `0.65rem` | `text-transform: uppercase`, `letter-spacing: 1px` |
| **Section number** (01, 02…) | JetBrains Mono | 400 | `0.7rem` | Color: `--accent` |
| **Section title label** | JetBrains Mono | 400 | `0.75rem` | `text-transform: uppercase`, `letter-spacing: 3px`, color: `--dim` |
| **Buttons** | JetBrains Mono | 400 | `0.6rem`–`0.75rem` | — |
| **Dates/locations** | JetBrains Mono | 400 | `0.7rem` | Color: `--dim` |
| **Tech tags/pills** | JetBrains Mono | 400 | `0.55rem` | Color: `--text-secondary` or `--dim` |
| **Achievement value** | JetBrains Mono | 600 | `1.5rem` | Color: `#fff` |
| **Venue name** | JetBrains Mono | 400 | `0.75rem` | Color: `--accent` |
| **Footer** | JetBrains Mono | 400 | `0.65rem` | Color: `--dim` |
| **Figure caption** | Inter | 400 | `--text-sm` | Lead "Figure 1." in `--ink`, rest `--ink-secondary` |
| **Sidenote** | JetBrains Mono label + Inter value | 400 | `--text-xs` / `--text-sm` | Label uppercase `--ink-muted` |
| **"Currently reading"** | JetBrains Mono | 400 | `0.75rem` | Left border accent, `--bg-card` bg |

### Typography Principles

1. **Monospace = technical.** Anything that feels "code-like" (nav, labels, tags, dates, equations) uses JetBrains Mono
2. **Sans-serif = narrative.** Story-telling paragraphs, headings, descriptions use Inter
3. **Uppercase + letter-spacing** for all labels and navigation
4. **No decorative fonts.** Two fonts only, strict separation of concerns
5. **Sizes stay small.** Most text is sub-1rem; only the hero title and contact H2 go large

---

## 4. Layout System

### Global

```css
/* Max content width */
max-width: 1400px;
margin: 0 auto;

/* Horizontal padding */
padding-left: 5%;
padding-right: 5%;

/* Section vertical rhythm */
section {
    padding: 6rem 5%;
}
```

### Grid Patterns

```css
/* About: fixed sidebar + fluid content */
grid-template-columns: 220px 1fr;
gap: 4rem;

/* Projects: responsive auto-fit */
grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
gap: 1.5rem;

/* Skills / Education / Achievements: responsive auto-fit */
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 1.5rem; /* or 2rem for skills */

/* Contact: equal halves */
grid-template-columns: 1fr 1fr;
gap: 4rem;

/* Social links: 2-column grid */
grid-template-columns: repeat(2, 1fr);
gap: 1rem;

/* Abstract row: paragraph + sidenote column */
grid-template-columns: minmax(0, 68ch) minmax(240px, 320px);
```

### Fixed Header

```css
header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem 5%;
    backdrop-filter: blur(12px);
    background: rgba(10, 10, 10, 0.9);
    border-bottom: 1px solid var(--border);
    z-index: 100;
}
```

### Section Header Pattern

Every section starts with this pattern:

```
[accent number]  [dim uppercase label]  [───── horizontal line ─────]
     01              ABOUT              ━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```css
.section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 3rem;
}
.section-number { color: var(--accent); font-size: 0.7rem; }
.section-title  { color: var(--dim); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 3px; }
.section-line   { flex: 1; height: 1px; background: var(--border); }
```

---

## 5. Component Library

### 5.1 Cards

```css
/* Base card */
background: var(--bg-card);
border: 1px solid var(--border);
border-radius: 4px;
padding: 1.5rem; /* or 2rem for publication cards */
transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);

/* Card hover — universal pattern */
&:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}
```

Used for: project cards, education cards, achievement cards, publication cards, timeline items.

### 5.2 Tech Tags / Pills

```css
font-family: 'JetBrains Mono', monospace;
font-size: 0.55rem;
padding: 0.25rem 0.5rem;
background: var(--bg-elevated);
border: 1px solid var(--border);  /* experience tags have border; project tags don't */
border-radius: 2px;
color: var(--text-secondary);

&:hover {
    border-color: var(--border-hover);
    color: var(--text);
}
```

### 5.3 Buttons

**Primary (high emphasis):**

```css
background: #fff;
color: #000;
border: 1px solid #fff;
font-family: 'JetBrains Mono', monospace;
font-size: 0.75rem;
padding: 0.8rem 1.5rem;
border-radius: 2px;

&:hover {
    background: transparent;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
}
```

**Secondary (low emphasis):**

```css
background: transparent;
color: var(--text);
border: 1px solid var(--border);

&:hover {
    border-color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
}
```

**Sweep animation on all buttons:**

```css
.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s;
}
.btn:hover::before { left: 100%; }
```

### 5.4 Timeline (Experience)

```css
/* Vertical line */
.timeline { padding-left: 2rem; position: relative; }
.timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--border);
}

/* Dot marker */
.timeline-item::before {
    width: 10px;
    height: 10px;
    background: var(--bg);
    border: 2px solid var(--accent);
    border-radius: 50%;
}

/* Current/active job: filled dot */
.timeline-item.current::before {
    background: var(--accent);
}

/* Hover: slide right */
.timeline-item:hover { transform: translateX(5px); }
```

### 5.5 Publication Card

- "New" badge: `background: var(--accent)`, `color: #000`, `font-size: 0.55rem`, pulse animation
- Publication links: bordered pills with monospace text, hover → white border + text
- Disabled link: `opacity: 0.5`, `cursor: not-allowed`

### 5.6 Achievement Card

```
[ SVG Icon ]
[ Large monospace value ]   e.g. "AIR 221"
[ Title ]                   e.g. "GATE EE 2022"
[ Subtitle ]                e.g. "Score: 803 | Marks: 73/100"
[ View Certificate → ]      accent green link
```

### 5.7 "Currently Reading" Block

```css
font-family: 'JetBrains Mono', monospace;
font-size: 0.75rem;
color: var(--dim);
padding: 0.75rem 1rem;
border-left: 2px solid var(--accent);
background: var(--bg-card);
border-radius: 0 4px 4px 0;
/* Highlighted text inside uses color: var(--accent) */
```

### 5.8 Social Links

```css
display: flex;
align-items: center;
gap: 0.75rem;
font-family: 'JetBrains Mono', monospace;
font-size: 0.75rem;
padding: 1rem;
background: var(--bg-card);
border: 1px solid var(--border);
border-radius: 2px;
color: var(--text-secondary);

&:hover {
    border-color: var(--border-hover);
    color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}
```

### 5.9 Academic Service List

Flat rows (not cards) — each row: `[Role] — [Venue link] [Description]`

```css
.service-item {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border);
}
```

---

## 6. Image Treatment

### Grayscale → Color on Hover

All images (profile photo, project previews) are grayscale by default and colorize on hover:

```css
img {
    filter: grayscale(100%) sepia(20%) hue-rotate(80deg) brightness(0.9);
    transition: filter 0.4s ease;
}

/* On parent hover */
.project-card:hover img,
.profile-photo:hover img {
    filter: grayscale(0%) sepia(0%) hue-rotate(0deg) brightness(1);
}
```

The `sepia(20%) hue-rotate(80deg)` gives a subtle green tint matching the accent color.

### Image Formats

- **WebP** primary with **PNG** fallback via `<picture>` element
- **Lazy loading** on all below-fold images: `loading="lazy"`
- **Explicit dimensions** on all `<img>` tags (`width`, `height`) for CLS prevention

---

## 7. Animations & Interactions

### 7.0 Layout System — the rules every section follows

Two layouts, both in `base.css`, and no component sets its own column widths:

- **`.l-margin`** — main column + margin column (`minmax(0, 1fr)
  var(--margin-col)`, `var(--col-gap)` between; one column below 1024px).
  Every text block uses it: hero, Figure 1's caption + legend, abstract,
  experience, research, contact. Their margin columns are one column down the
  page. Prose in the main column caps at `var(--measure)`.
- **`.card-grid`** — galleries (projects, education, achievements). Cards wrap
  at `--card-min` and grow to fill their row, so a short last row stretches
  instead of leaving holes, at any count and width. Project previews use a
  fixed height with `object-fit: contain` so stretched cards still line up.

Three shared components (`src/styles/components/`):

| Component | Used for | Never use instead |
|---|---|---|
| `.meta` (+ `__row`, `__label`, `__value`, `__sub`) | Everything in the margin column: byline, sidenotes, figure legend, when/where/stack, venue/citations, contact details | Ad-hoc label/value markup |
| `.pill` / `.pill--primary` in a `.pill-row` | Every link-button: hero, publication links, contact | Boxed buttons, tiles |
| `.tag` in a `.tag-row` | Every technology/topic label: stack, project tech, skills | Per-section chip styles |

Rows of entries (experience, research) are separated by a hairline across
both columns. The experience rail sits in the page gutter
(`left: calc(var(--gutter) / -2)`) so text keeps the page's left edge; it
hides below 600px where the gutter is too narrow.

### 7.1 Hero — Research-Paper Title Page

The landing section is laid out like a distill.pub article header:
two columns — title, one-line dek and the **pill link row** (first pill is
the primary action, filled `--ink`) on the left; the **byline** (Author with
avatar, Affiliation, Works on, Published) as label/value rows behind a
hairline on the right, bottom-aligned — then **Figure 1** at full width.
Below 1024px the byline drops under the links. Content lives in
`src/data/hero.ts`; byline facts derive from `experience` and `publications`.

### 7.2 Figure 1 — Flow Matching, Live

Code: `src/lib/flow/` (framework-agnostic), bound by `useFlowFigure`.

- **Space-time layout** — noise `x₀ ~ N(0, I)` drawn on the left, the data
  (`x₁ ~ p_data`, a stippled image) on the right; the cloud's position between
  them *is* `t`. Phones stack them.
- **Every dot is a live sample.** No faint copies of the start or end
  distributions: they read as samples left behind and doubled the picture
  near t = 1. The dashed σ rings mark where samples start; the labels name
  both ends; the picture forms only as the samples arrive.
- **Velocity arrows on the samples** — ~50–110 of them (only samples starting
  within 2σ), each a short accent arrow on its dot pointing along its drawn
  motion. They fade as the samples arrive at t → 1. No long rays: motion and
  arrows already show the straight travel.
- Labels are drawn on top of the samples on a dark backing, so passing
  samples never cover them.
- **One time axis** — a native range input laid over the plot's bottom strip,
  styled as a hairline with an accent thumb, flanked by a round play/pause
  button, `t=0` and `t=1`. On side-by-side layouts its ends are pinned under
  the noise and data centres (`--axis-start` / `--axis-end`), so the thumb
  sits under the cloud. The cloud can also be dragged with a mouse.
- **Caption + legend** — on the page grid under the plot. Caption: what
  flow matching does, the one equation (`x_t = (1 − t)·x₀ + t·x₁`), and what
  the data is. Legend (`.meta`, margin column): Samples, Arrows, Rings,
  each with a swatch drawn like the mark. No live readouts.
- **Playback — loops forward, never backwards.** Each ~10 s cycle is one
  sample: fresh noise fades in, a 0.8 s beat with arrows visible, 6 s from
  noise to data, 2.5 s resting on the picture, then the picture fades out
  and new noise is drawn while nothing is visible. It never runs t
  backwards: data → noise is diffusion's noising process, not sampling.
  Scrub + play resumes forward from where the reader left it. Pauses when
  scrolled away or the tab is hidden.
- Static parts render once to an offscreen layer; the live cloud uses a
  `Float32Array`, 32 brightness buckets and `fillRect`. Particle count scales
  with plot area (6k–18k).
- **Target** is swappable in `data/hero.ts`: any transparent PNG/WebP, or
  `twoMoons` / `eightGaussians` / `checkerboard` / `lorenz`.

### 7.3 About — Abstract With Sidenotes

Three paragraphs, each paired with Tufte-style sidenotes (mono label + value
on one line, left hairline) in a margin column. Below 1024px the notes drop
under their paragraph.

### 7.4 Section Reveal on Scroll

```css
.section-reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}
.section-reveal.visible {
    opacity: 1;
    transform: translateY(0);
}
```

Triggered by `IntersectionObserver` at `threshold: 0.08`. Once visible, observer disconnects (one-time animation).

### 7.5 Card Hover

Universal lift pattern:

```css
transform: translateY(-4px);
box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
border-color: var(--border-hover);
transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
```

### 7.6 Pulse Animation (New badge)

```css
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.4; }
}
```

### 7.7 Accessibility: Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .section-reveal { opacity: 1; transform: none; transition: none; }
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

The hero figure is not hidden under reduced motion: it skips autoplay and
opens on the finished picture (t = 1). Scrubbing still works.

---

## 8. Responsive Design

### Breakpoint: `900px`

### Mobile Changes

| Element | Desktop | Mobile (≤900px) |
|---|---|---|
| **Nav** | Horizontal links | Hidden → hamburger menu |
| **Header CTA** | Visible (Blog + Collaborate) | Hidden → inside mobile drawer |
| **Mobile drawer** | N/A | Slide-in from right, 320px/85vw width |
| **Projects grid** | Auto-fit multi-column | Single column |
| **Contact grid** | `1fr 1fr` | Single column |
| **Exp header** | Row (title + date) | Column (stacked) |
| **Service items** | Row layout | Column, separator hidden |
| **Hero byline** | Column beside the title | Under the links (≤1024px) |
| **Figure 1 plot** | 3:1, side by side | 16:9 (≤1024px); 2:3 stacked (≤600px) |
| **Abstract sidenotes** | Margin column | Under each paragraph (≤1024px) |

### Mobile Menu

```css
/* Hamburger → X animation */
.mobile-menu-btn.active span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.mobile-menu-btn.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.mobile-menu-btn.active span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* Drawer */
.mobile-nav {
    width: min(320px, 85vw);
    height: 100dvh;
    background: rgba(15, 15, 15, 0.98);
    backdrop-filter: blur(20px);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-nav.active { transform: translateX(0); }

/* Overlay behind drawer */
.mobile-nav-overlay {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
}

/* Body scroll lock */
body.menu-open { overflow: hidden; }
```

---

## 9. Icons

- **No icon library** — all icons are inline SVGs
- Consistent: `width="16" height="16"`, `stroke="currentColor"`, `stroke-width="1.5"`, `fill="none"`
- Larger icons for achievements: `width="24" height="24"`
- SVGs include `aria-hidden="true"` for accessibility

---

## 10. Performance Patterns

| Technique | Implementation |
|---|---|
| **Preconnect** | `<link rel="preconnect" href="https://fonts.googleapis.com">` |
| **WebP + fallback** | `<picture><source srcset="*.webp" type="image/webp"><img src="*.png"></picture>` |
| **Lazy loading** | `loading="lazy"` on all below-fold images |
| **Explicit dimensions** | `width` + `height` on every `<img>` |
| **Canvas optimization** | `Float32Array`, 32-bucket color pre-computation, `fillRect` over `arc()`, `Path2D` batching |
| **Passive scroll** | `{ passive: true }` on scroll listeners |
| **Font display** | `display=swap` on Google Fonts URL |
| **DNS prefetch** | `<link rel="dns-prefetch" href="https://api.semanticscholar.org">` |

---

## 11. SEO & Metadata Patterns

- **Structured Data:** JSON-LD for `ProfilePage`, `Person`, `WebSite`, `Blog`, `ScholarlyArticle`, `BreadcrumbList`
- **Open Graph:** Full og:title, og:description, og:image (1200x630), og:type
- **Twitter Card:** `summary_large_image` with creator handle
- **Canonical URL:** `<link rel="canonical" href="https://rohit.vision/">`
- **Robots:** `index, follow, max-image-preview:large`
- **Skip to content:** Accessibility link hidden until focused
- **Noscript fallback:** Semantic HTML with `itemprop` attributes for crawlers
- **ARIA labels:** On all interactive elements, `aria-label` on icon-only links
- **Theme color:** `<meta name="theme-color" content="#0a0a0a">`

---

## 12. File Structure

```
/
├── index.html              # Single-page HTML
├── main.css                # All styles (no preprocessor)
├── script.js               # Canvas animation, menu, scroll, typewriter
├── 404.html                # Custom 404
├── robots.txt              # Crawl rules
├── sitemap.xml             # Sitemap
├── CNAME                   # Custom domain (rohit.vision)
├── assets/
│   ├── images/             # Profile, project previews (.webp + .png)
│   ├── certificates/       # PDF/JPEG certificates
│   ├── report/             # PDF reports
│   ├── og-image.png        # Social sharing image
│   ├── conference-logos/
│   ├── experience-logos/
│   └── institution-logos/
└── tacle/                  # Subpage for TACLE publication
```

---

## 13. Quick Reference — Design Tokens Cheat Sheet

```
Background:      #0a0a0a → #111111 → #161616  (3-tier elevation)
Text:            #e8e8e8 → #999999 → #888888  (3-tier hierarchy)
Accent:          #4ade80                        (green, one accent only)
Borders:         #222222 → #444444              (default → hover)
Fonts:           JetBrains Mono (technical) + Inter (narrative)
Border-radius:   2px (tags, buttons) or 4px (cards)
Transition:      0.15s cubic-bezier(0.4, 0, 0.2, 1) for interactions
                 0.3s ease for color/opacity changes
                 0.6s ease for scroll reveals
Card hover:      translateY(-4px) + box-shadow: 0 8px 25px rgba(0,0,0,0.3)
Button hover:    translateY(-2px) + box-shadow: 0 4px 20px rgba(255,255,255,0.1-0.15)
Max-width:       1400px
Padding:         5% horizontal, 6rem vertical sections
```
