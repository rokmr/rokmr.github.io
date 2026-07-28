# rohit.vision — Portfolio TODO

> Score: **~8.5/10**  
> Code/infra/a11y are solid. What's missing is content that gets you hired: resume, impact metrics, demo artifacts.

---

## 🔴 High Priority

### Resume
- [ ] Add PDF resume to `assets/` → header button + Contact link (`.cv-btn` class ready)

---

## 🟡 Medium Priority

### Impact Metrics (needs your real numbers)
- [ ] Armada AI bullets — latency %, queries/day, retrieval accuracy gain
- [ ] Avataar AI bullets — images generated, PSNR gain, pipeline speedup
- [ ] Project descriptions — accuracy numbers, scale, speed
- [ ] Hero stats bar — consider "1 Publication" or HuggingFace downloads

### Content Gaps
- [ ] Add 2–3 blog post teasers/previews on the main page (title + date + one-liner) — drives clicks to `/blogs/`
- [ ] Add demo GIFs or screenshots for proprietary projects (Agentic RAG, Lifestyle Gen) since no repo links exist

### Social Proof
- [ ] GitHub star counts on cards (TACLE ★4)
- [ ] Testimonial quote from colleague/professor

---

## 🟢 Low Priority / Nice to Have

### Code Cleanup
- [ ] Remove unused asset directories: `conference-logos/`, `experience-logos/`, `institution-logos/` — none referenced in HTML
- [ ] Remove unused certificates: `GATE_EE_2021.pdf`, `GenAI-Hackathon-2023.jpg`, `MATLAB.png`, `PowerSystem_2020.png` — not linked anywhere

### Performance
- [ ] Consider subsetting Google Fonts (JetBrains Mono + Inter with 4 weights each is heavy) — only load weights actually used
- [ ] Switch manual cache busting (`script.js?v=5.0`) to content-hash based if adding a build step

### UX Enhancements
- [ ] Blog post count or latest post preview in Blog CTA
- [ ] "Tools I Use" micro-section
- [ ] Dark/light toggle (low ROI)

---

## Completed

**Structure** — 11 sections → 8 · Merged achievements+certs into Education · Coursework collapsed into IISc card · Removed weak entries (GATE 2021, 10th, GenAI Hackathon) · Projects 2→5 (TACLE, Agentic RAG, Lifestyle Gen, VTON, Cricket) · Volunteering → Academic Service (CVPR/ECCV 2026 Reviewer) · "Currently reading: RL" · Footer: "Handcrafted with PyTorch-level attention to detail"

**Visual** — Consistent 16:9 project thumbnails (SVG diagrams for proprietary projects) · OG image (1200×630) · Section fade-in (IntersectionObserver) · Mouse proximity denoising · Card hover micro-interactions

**A11y & Perf** — Skip-to-content link · `loading="lazy"` on all images · Descriptive alt texts · `prefers-reduced-motion` (hides canvas, kills animations)

**Mobile** — Minimal HUD (timestep+progress only) · Terminal hidden · Hamburger drawer nav

**SEO** — JSON-LD (Person, WebSite, Blog, ScholarlyArticle) · OG + Twitter Cards · Sitemap (/, /tacle/, /blogs/, 2 posts) · Meta+keywords include reviewer credentials

**Design** — Dark #0a0a0a + green #4ade80 · Lorenz attractor + flow matching HUD · JetBrains Mono + Inter

**Citations** — Auto-fetch from Semantic Scholar API (arXiv:2407.08041) · Fallback to hardcoded Google Scholar count (`data-fallback`) · Only upgrades, never downgrades · Link → Google Scholar cites page · Badge hidden-safe if count is 0

**IndieWeb** — `rel="me"` on all social profile links (LinkedIn, GitHub, X, Scholar, HuggingFace) for Mastodon verification + RelMeAuth

**Footer** — Dynamic copyright year via `textContent` on `#footer-year` span — never needs manual update

**Code cleanup** — Removed ~200 lines dead CSS (status-badge, tech-tags, forms, coursework, control-divider, gpu-name) · Removed ~35 lines dead JS (chess pattern) · Fixed stale comment · Removed duplicate CSS comment · `innerText` → `textContent` in rAF loop · Trailing newline at EOF

**Bug fixes** — Footer invisible (missing z-index + section-reveal stuck at opacity:0) · polyfill.io security vulnerability removed · Typos fixed (Muzzafarpur, missing space in TACLE title) · Blog link missing target/rel · `</main>` indentation

**Image optimization** — All `<img>` tags have explicit `width`/`height` attrs · Profile photo self-hosted as WebP (20KB) + PNG fallback · TACLE intro self-hosted (86KB WebP vs external raw.githubusercontent) · `<picture>` + WebP for all raster images (VTON 24KB, Cricket 43KB) · SVGs keep native dimensions

**Font Awesome killed** — All 9 FA `<i>` icons replaced with inline SVGs · FA CDN `<link>` removed · cdnjs preconnect removed · ~90KB less to download

**Accessibility pass** — 42 decorative SVGs get `aria-hidden="true"` · 30 links get descriptive `aria-label` · `--dim` bumped from `#666` to `#888` (WCAG AA compliant ~5.5:1)

**UX** — Back-to-top button (appears after hero, `scroll` listener with `{ passive: true }`) · `document.write` replaced with `textContent` on `#footer-year` · Hero grid fixed to single column · `.DS_Store` purged from tracked files

**New assets** — `assets/images/profile.webp` (20KB), `assets/images/profile.png` (249KB fallback), `assets/images/tacle_intro.webp` (86KB), `assets/images/tacle_intro.png` (205KB fallback), `assets/images/vton_preview.webp` (24KB), `assets/images/cricket_shot_preview.webp` (43KB)

**Security headers** — Deployed via Cloudflare Response Header Transform Rules (no code changes). `Content-Security-Policy` (strict `default-src 'none'` with explicit allowlist for Google Fonts, MathJax, Semantic Scholar API) · `Strict-Transport-Security` (HSTS 1 year) · `X-Frame-Options: DENY` · `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy` (camera/mic/geo/FLoC disabled) · `Remove X-Powered-By` managed transform enabled · `404.html` favicon + `--dim` color fixed to match main site

---

*Last updated: July 2025*
