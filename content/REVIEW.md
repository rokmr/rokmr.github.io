# Independent review and corrections

Reviewed 25 October 2026. Three independent agents reviewed the implemented
React portfolio and made corrections in separate file areas. The parent agent
reconciled their changes, updated the master/public projection, and checked the
combined result. The initial source review is supplemented by the browser and PDF verification below.

| Perspective | Finding | Correction |
| --- | --- | --- |
| Hiring / recruiter | Evidence buried in a long skills list; résumé relied on first-N bullets | Three relevant verified skill groups and explicit per-role résumé selections; ownership, cost baseline and evaluation prioritized |
| Hiring / recruiter | Support, Almanac and inherited Assistant scope could be conflated | Named the Support workflow; retained sole engineering ownership for Almanac and contributor status for Assistant |
| Hiring / recruiter | Unsupported TA assignment-design/grading wording | Removed; retained named courses and confirmed technical work |
| Hiring / recruiter | Professional evidence was hard to reach | Company links, direct professional project links, contextual publication links and aligned education dates |
| Research | TACLE citation pointed only to arXiv; exact publication date was invented | WACV 2025 citation, known publication year, no invented day |
| Research | Method descriptions and credit could be misunderstood | TACLE stored-statistics/current-task caveats; AttriStory latent refinement; co-first note explicitly names Manogna and Rohit |
| Research | Generic figure descriptions | Descriptive method/result image alt text |
| UX / accessibility | Navigation could steal focus on modified clicks | Preserve native Ctrl/Cmd/Shift-click behavior; move focus only for ordinary navigation |
| UX / accessibility | Mobile menu stayed open outside its useful context | Close on outside interaction, Escape and wider layouts |
| UX / accessibility | Repeated links lacked context | Accessible names identify the project, paper or certificate |
| UX / accessibility | Contact wrapping and repeated copy feedback | Keep copy control beside wrapping email; reset feedback timer and contain failure message |
| UX / accessibility | Fixed pixel typography and short link targets | Rem-based type; 44px targets for footer, certificate, work-title and document-navigation links |
| Integration | SEO advertised an absent search feature and unconfirmed skill | Removed SearchAction, Reinforcement Learning keyword and unsupported profile dates; corrected Armada organization URL |
| Integration | Case studies repeated ownership and editorial caveats | More direct problem/contribution prose; preserved the approved similar-workload cost qualification |

## Verification

- TypeScript passes.
- 72 tests pass: 64 Vitest and 8 content-boundary tests.
- Static production build prerenders the homepage, résumé, work index, all case
  studies, and TACLE; sitemap derives from those routes.
- Master/public consistency checks and private-field exclusion checks pass.
- No deployment or git commit performed by the review agents.

## Browser and PDF verification — 25 October 2026

- Playwright Chromium: 336 layout checks across seven pages, twelve widths
  (320–1920px), light/dark themes and 16px/32px root text. No horizontal
  overflow or off-screen content elements in the checked states.
- Screenshot inspection caught clipped navigation at 801px with doubled text.
  Rem-based breakpoints now switch composition with text size.
- Screenshot inspection caught inherited prose-list margins offsetting diagram
  stages. Reset those margins and added an alignment assertion.
- Keyboard skip link, section focus, menu Escape/outside dismissal, bottom-page
  active navigation, clipboard success/denial and PDF download link pass.
- Three technical diagrams captured at mobile, tablet and desktop widths in
  dark mode; representative captures visually inspected alongside homepage
  light/dark compositions.
- Browser print and separate LaTeX PDF each render to two A4 pages; every page
  inspected for clipping, awkward breaks and missing text. Download is at
  `/assets/Rohit-Kumar-Resume.pdf`.
- Reproduce with a local server on port 8001, `npx playwright install chromium`,
  then `npm run test:browser`. Outputs stay in ignored `tmp/browser/`.
- Rebuild the PDF with `npm run resume:pdf` (Tectonic required). The generator
  reads shared public data, writes intermediate files to ignored `output/pdf/`,
  and copies the compiled PDF to `public/assets/`.

These are Chromium checks, not a claim of testing every browser or assistive
technology. Unconfirmed metrics and internal report material remain unpublished.
