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
- 75 tests pass: 67 Vitest and 8 content-boundary tests.
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

## Cross-page content audit — 26 October 2026

- Homepage introduction includes both product imagery and novel-view work.
- Shared publication-display data supplies equal-contribution markers to the
  homepage and résumé; no author-name parsing from narrative notes.
- All work includes published projects without a case study through their
  existing resource links. Virtual Try-On and its report are now discoverable;
  its description distinguishes the three-stage and single-stage approaches
  supplied in the original notes.
- Project names agree between the legacy catalog and case-study records.
- Almanac's short ownership line names its engineering scope.
- Lifestyle copy describes the pipeline built, without an unconfirmed production
  shipment or a measured improvement claim.
- Inference deployment wording avoids repeating the same claim across paragraphs.
- Master/public projection checks, 73 tests, TypeScript and production build pass.
- 336 responsive states pass; keyboard/menu/copy checks pass. Twelve local pages
  crawled, with 35 internal link/asset destinations checked successfully.

The homepage remains a selection, while All work exposes the broader public
collection. Private notes and unapproved metrics remain excluded. Some detailed
copy still lives in typed modules during the documented master-data migration.

## Visual-system and diagram review — 26 October 2026

Shared tokens now own the editorial palette, body/display typography, spacing,
rules, icon geometry, control borders, popup shadow and diagram geometry.
Print styling is consolidated. Diagram captions use the body sans-serif family,
visible role labels no longer fall below 12px, and portfolio focus controls do
not retain the former neon shadow.

Almanac explicitly connects its knowledge index to retrieval. Inference planning
shows the recommendation-to-deployment handoff in two named lanes. Both use
typed references to real stage IDs, verified in unit tests. A cascade regression
that suppressed output fill, comparison borders and store rules was corrected
and is covered by browser assertions.

Verification: 74 unit/content tests, TypeScript and production build pass;
336 responsive states and keyboard/menu/clipboard checks pass. The new
`npm run test:design` passes 96 diagram states with centered, non-overlapping
connectors, unclipped labels, consistent captions/role styling and at least
4.5:1 computed text contrast against both diagram surfaces. UI icon sizes and
minimum labels are also checked on the home, work and résumé pages.
Light/dark diagram captures, desktop/mobile home composition and both browser
print pages were visually inspected. Browser résumé print remains two pages.
The separate downloadable PDF's content and layout were not changed by this pass.

Streamline diagram icons added 26 October 2026: locally hosted Core Line subset,
normalized to the common stroke/color treatment. Explicit per-stage meanings
and captions remain readable without icons. Source/license notes and visible
case-study credits accompany the assets. Unit checks cover symbols/attribution;
96 diagram states verify actual SVG rendering and visual constraints.
