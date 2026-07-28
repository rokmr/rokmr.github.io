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
| `--accent` (#4ade80) | Section numbers, venue names, "currently reading" highlights, active timeline dots, skill category headings, achievement links, canvas arrows, progress bar |
| `#fff` / `#000` | Primary buttons only (white bg / black text). Also used for hover-state text |
| `rgba(74,222,128,α)` | Accent green with transparency (canvas vectors, overlays) |

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
| **Hero H1** | Inter | 700 | `clamp(2rem, 3.5vw, 2.8rem)` | `line-height: 1.15`, `letter-spacing: -0.02em` |
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
| **Stats (hero)** | JetBrains Mono | 600 | `1.5rem` (value), `0.7rem` (label) | Value: `#fff`, Label: `--dim` uppercase |
| **Achievement value** | JetBrains Mono | 600 | `1.5rem` | Color: `#fff` |
| **Venue name** | JetBrains Mono | 400 | `0.75rem` | Color: `--accent` |
| **Footer** | JetBrains Mono | 400 | `0.65rem` | Color: `--dim` |
| **Terminal** | JetBrains Mono | 400 | `0.65rem` | Color: `--dim` |
| **"Currently reading"** | JetBrains Mono | 400 | `0.75rem` | Left border accent, `--bg-card` bg |

### Typography Principles

1. **Monospace = technical.** Anything that feels "code-like" (nav, labels, stats, tags, dates, terminal) uses JetBrains Mono
2. **Sans-serif = narrative.** Story-telling paragraphs, headings, descriptions use Inter
3. **Uppercase + letter-spacing** for all labels and navigation
4. **No decorative fonts.** Two fonts only, strict separation of concerns
5. **Sizes stay small.** Most text is sub-1rem; only hero H1 and contact H2 go large

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

/* Hero: single column */
grid-template-columns: 1fr;
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

### 7.1 Canvas — Lorenz Attractor Particle System

- **16,000 particles** in a `Float32Array` (performance-optimized, no GC)
- Particles interpolate from **random noise** → **Lorenz butterfly shape**
- Simulates a **diffusion denoising / flow matching** process
- Green vector field arrows fade as denoising progresses
- Grid background behind particles, axes slightly brighter
- **Fades on scroll** — `opacity = max(0, 1 - scrollY / heroHeight)`
- **Mouse interaction** — horizontal cursor position controls denoising `t`
- **Auto-plays** on load: `t` goes from 0.8 → 1.0 over ~5 seconds, then loops

### 7.2 HUD Control Panel (bottom-center)

Fixed panel showing training-like stats:

```
[ STEP: 1/50 ] [ ████░░░░ ] [ t=0.80 ] [ NOISE: 0.20 ]
```

- Fades with canvas on scroll
- Hidden on mobile (labels removed, only timestep + progress shown)

### 7.3 Terminal Typewriter (bottom-left)

```
rohit@iisc:~$ python inference.py▋
```

- Rotates through ML-themed messages
- Blinking green cursor (`animation: blink 1s step-end infinite`)
- Hidden on mobile

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
    #flow-canvas { display: none; }
    .control-panel, .terminal-init { display: none; }
    .section-reveal { opacity: 1; transform: none; transition: none; }
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 8. Responsive Design

### Breakpoint: `900px`

### Mobile Changes

| Element | Desktop | Mobile (≤900px) |
|---|---|---|
| **Nav** | Horizontal links | Hidden → hamburger menu |
| **Header CTA** | Visible (Blog + Collaborate) | Hidden → inside mobile drawer |
| **Mobile drawer** | N/A | Slide-in from right, 320px/85vw width |
| **Hero H1** | `clamp(2rem, 3.5vw, 2.8rem)` | `1.6rem` |
| **Hero story** | `0.95rem` | `0.85rem` |
| **Stat values** | `1.5rem` | `1.2rem` |
| **Buttons** | `0.75rem`, `0.8rem 1.5rem` | `0.65rem`, `0.6rem 1rem` |
| **About grid** | `220px 1fr` | Single column |
| **Profile photo** | `220px` | `160px`, centered |
| **Projects grid** | Auto-fit multi-column | Single column |
| **Contact grid** | `1fr 1fr` | Single column |
| **Exp header** | Row (title + date) | Column (stacked) |
| **Control panel** | Full (step/noise/progress/time) | Minimal (progress + time only) |
| **Terminal** | Visible | `display: none` |
| **Service items** | Row layout | Column, separator hidden |

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
