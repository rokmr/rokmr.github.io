# Editorial portfolio design study

Status: implemented in the React portfolio. The earlier standalone study is
retained as a reference; the React site is now the review target. Preview at `/design-preview.html` in the Vite development server.
The study is outside `public/` and is not an entry in the production build.

## Reference lessons

- Chip Huyen, https://huyenchip.com/: introduce the person and establish
  professional context before asking readers to inspect a technical catalogue.
- Jon Barron, https://jonbarron.info/: keep research prominent, with clear
  publication context and direct, useful resource links.
- Andrej Karpathy, https://karpathy.ai/: make the relationship between career
  history and the work understandable.

These are content-hierarchy references. The proposed typography, palette and
page shell below are a separate visual direction for Rohit.

## What was going wrong

The previous iterations treated each section as a local styling problem. That
produced several competing button, row, heading, disclosure and metadata
patterns. Adding another rule or icon did not establish a hierarchy. Global
`header`, `nav` and `section` rules plus later overrides also made component
behavior harder to predict.

The redesign must replace that layering with a defined set of components, not
add another final stylesheet to conceal conflicts.

## Direction

A personal, editorial research portfolio. Use an understated page index,
readable publication records, concise engineering evidence, and a human
introduction. Research remains the first full section. Production experience
is visible alongside it through Engineering and Experience.

The working preview includes the entire page, selectable width limits with an actual-width readout, and a dark
palette using the same composition. Those controls belong to the design study,
not to the proposed portfolio UI.

## System decisions

- One reading environment, with a warm neutral paper palette and a corresponding
  charcoal palette. A muted green is reserved for links, focus and venue labels.
- Georgia for the name and chapter headings; system sans for factual content,
  controls and metadata. No monospace navigation, decorative all-caps labels,
  or technology tags masquerading as primary content.
- Desktop maximum width 1280px: 152px index, 56px separation, and the remaining
  space for content. At 1120px and above, chapter labels take an intrinsic column with a 10rem preferred width
  beside the section body. The index is sticky in page flow. Text stays near
  54–62 characters per line; spare space supports orientation and grouping.
- Name 52px, chapter heading 28px, work/paper heading 18px, body 14–15px,
  metadata 11–12px. Phone uses an explicitly composed smaller hierarchy.
- 8/12/16/24/32/40/64px spacing relationships. Spacing expresses groups:
  compact within a record, moderate between records, generous between chapters.
- One small control radius. No large filled cards or panels around ordinary
  text. Thin rules separate records only when the separation is useful.
- One strong email action in the introduction; the closing section gives the
  actual email address with a small icon-only copy action. Resource links use
  a single leading type icon, not repeated trailing arrows or outlined buttons.
- The portrait supports the introduction; it does not replace a relevant
  explanation. Diagrams must provide useful evidence before receiving space.
- Paper name, research subject, authors, venue and resources form one unit.
  No separate citation-label table or disclosure merely to read the summary.
- Employment rows establish scope and time. They do not repeat every project
  case-study sentence.
- Secondary credentials remain available without having the same visual
  weight as research and production work.
- Keep interaction limited to navigation, links, optional supporting content,
  and feedback that helps an action. No decorative entrance sequence required
  to read the page.

## Responsive composition

Use container width, so embedded previews and actual windows follow identical
composition rules. These are content thresholds, not device detection.

| Available width | Composition | Use of space |
| --- | --- | --- |
| 1120px and above | Sticky page index, chapter-label column, reading column | Shared content axis; bounded text; 1280px page cap |
| 1001–1119px | Page index and single content column | Labels above records; avoid squeezing publication text |
| 801–1000px | Compact identity and horizontal navigation | Return sidebar space to reading; smaller outer gutters |
| 361–800px | Identity and menu; name beside modest portrait | Full-width introduction and records; dates below employment/education |
| 320–360px | Smaller portrait, tighter gutters, stacked section metadata | Keep body text readable instead of shrinking the whole page |

The same story, record grouping, typography families, icon scale, and action
priority survive every composition. Heading/body alignment repeats between
Research, Engineering, Experience, Background, and Contact. The desktop label column uses intrinsic text sizing so a longer heading
can grow the track instead of overlapping the body. Horizontal navigation never wraps onto a second row;
it switches to the menu at 800px. Resource labels and their icons wrap as whole
links. The opening text has no forced line break. Resource links have 44px-high hit areas. Active index
markers reserve their space to prevent text shifting during scrolling.

The study selector offers 320, 390, 768, 1024, 1440, and 1920px width limits.
The displayed actual width is authoritative: the study never extends beyond
the browser window. The portfolio itself caps at 1280px on wider monitors;
extra width becomes outer margins, not longer paragraphs or enlarged images.
To inspect a genuinely wide viewport, also widen the browser window.

Visible focus, native links/disclosures, source order, and reduced-motion
preferences remain intact. The mobile menu is anchored to its own trigger,
not to the full browser window.

## Icons, actions, and voice

- Resource icons have a job: document for a paper, code brackets for a repository,
  browser window for a project page, and play for a runnable demo. Resource links have a
  visible text label; the familiar copy utility may use an icon with an
  accessible name and tooltip. Profile names such as GitHub already identify a destination
  and do not need another icon or arrow.
- The study uses no decorative diagonal arrows. An email address is a mail action,
  not a website launch. A project page is labeled “Project page”, not an ambiguous
  “Project”. Links keep their normal same-tab behavior.
- Chevrons indicate expandable content only. They rotate when the disclosure
  opens; they do not act as generic ornaments beside headings.
- Resource icons use a 24-unit viewBox, 1.5-unit stroke, and 15px rendered size.
  Center them in the same inline row as their labels, with a 7px gap and 44px
  hit area. Keep the icon and label together when rows wrap.
- Hover/focus strengthens the underline and icon color. No bouncing arrows,
  sliding labels, or positional changes that imply progress before activation.
- Repeated paper links have accessible names identifying the paper. Decorative
  SVGs are hidden from assistive technology; the visible label carries meaning.
- Contact uses just the linked email address and a borderless 15px copy icon
  inside a 44px hit area. Omit the explanatory invitation paragraph and visible
  “Copy email” label. Keep an accessible name and tooltip. Successful copying
  briefly changes the icon to a check, announced through a visually hidden
  status region; clipboard failures show a short visible message. The copy
  action does not replace the mail link. Hide it when the clipboard API is
  unavailable. Avoid a redundant email action in the page index.
- Copy starts with the work and the contribution. Introductions name current
  work, prior work, and education directly. Avoid slogans, self-awarded qualities,
  architecture acronyms without context, and duplicated calls to action.

## Content boundary

The prototype uses existing portfolio material only. Detailed internal Armada
notes are not incorporated. It is not a full factual rewrite or a completed
migration to the master source. Final implementation should consume the
reviewed public projection and preserve internal/public separation.

## Independent-review corrections

- Opening identifies the actual current title/company, then prior work and
  education. Sidebar no longer repeats the role and degree.
- Desktop introduction bounds the copy column and brings a 112px portrait closer
  to it; balanced wrapping avoids a forced breakpoint-specific line break.
- Heading tracks use intrinsic sizing instead of a fixed 148px width plus nowrap.
- Active navigation is derived from section positions in document order, updates
  after content resizing, and explicitly selects Contact at the page bottom.
  Both desktop and mobile navigation receive the same active state.
- Professional work offers native expandable engineering notes using already
  public portfolio content. No placeholder case-study routes or private metrics.
- TACLE explains its equal-contribution marker. Cricket’s unexplained accuracy
  percentage is omitted from the homepage summary; the demo stays available.
- Existing experience claims were narrowed: no “every knowledge-base agent”
  claim, no assertion that image-processing failures were universally fixed,
  and cost savings explicitly compare with the initial implementation.
- A résumé link remains pending a real, reviewed artifact; no dead link added.

## Integrated implementation

- `src/pages/Home.tsx` composes the public data with the editorial system in
  `src/styles/portfolio.css`. The previous homepage styles are no longer loaded.
- `/work/agentic-rag/`, `/work/lifestyle-generation/`, and `/work/cricket-shot/`
  provide substantive detail; new records live in `src/data/caseStudies.ts`.
- `/resume/` renders a printable résumé from the same public employment,
  publication, education and skills records. Its print control uses the browser's
  PDF output; a separate downloadable PDF or LaTeX source is not implied.
- Build prerenders every route, gives each its own canonical/description, and
  derives the deployed sitemap from those routes.
- The cost ratio was initially omitted. Rohit subsequently confirmed and
  approved public wording: approximately one-third of the initial graph’s cost
  per query/run, comparing similar workloads. Case study and résumé preserve
  those qualifications; measurement period and supporting record remain absent.

## Verification record (25 October 2026)

- Integrated homepage visually inspected in a real 390px iframe viewport.
  Document width was 390px, with zero measured elements outside the viewport.
  The inspection identified an orphaned LinkedIn link; profile links are now
  grouped and wrap as a unit. The post-fix layout has source verification only.
- Native Chrome capture later failed repeatedly with `cgWindowNotFound`.
  Remaining viewport boundaries, dark mode, text zoom, clipboard interaction,
  print layout, and the TACLE visual regression could not be visually signed off.
- `responsive-review.html` is a local-only review harness, outside the production
  build. It embeds the actual React homepage and reports viewport/document widths.
- Independent integration source review found no source-level blocker. Its
  keyboard focus, touch-target and route-scoping findings were corrected.

## Research and experience clarification

Rohit confirmed co-first/equal-contributor credit on AttriStory. Preserve the
published author order; display the credit as an explicit note rather than
silently adding an asterisk absent from the checked public versions. The paper
and project page support the benchmark and AttriLoss description, not a breakdown
of each author's implementation duties. Avataar experience was subsequently clarified as continued work on an existing
sparse-view-conditioned diffusion project for novel-view synthesis: fine-tuning,
conditioning changes, distributed training and SLURM. Preserve the senior
engineer’s initial-setup credit. No specific LRM architecture or measured quality
improvement is asserted. Cluster size is recorded privately pending confirmation
of per-job GPU usage.

## Expanded work collection

The homepage remains curated. `/work/` lists the broader collection, including
Support RAG Agent ownership, contributed AI Assistant work, Almanac and inference
planning. Detail routes and sitemap entries derive from the case-study records.
Only approved general technical scope is public; new accuracy figures remain
unpublished. Rohit subsequently confirmed that ingestion, chat, evaluation tooling and
inference planning work in an isolated VM. A fresh installation without internet
has not been tested; functional VM testing and offline installation are distinct.


## Independent implementation review

See `REVIEW.md` for the three-agent hiring, research and UX findings, implemented
corrections and verification boundaries. Role highlights are now selected
explicitly for the résumé; current public data and the master projection agree.
The case-study prose preserves facts and necessary qualifications without
repeating the editorial verification process to visitors.

## Completed browser and document pass

See `REVIEW.md` for the completed responsive, interaction and PDF checks.
Navigation breakpoints now respond to root text size. Diagram stages explicitly
reset prose-list margins to keep boxes and connectors aligned. The résumé has
a separate downloadable, two-page LaTeX PDF and a verified two-page print layout.
These results supersede the earlier browser-connection verification limits.

## Résumé page composition — 26 October 2026

The two-page résumé now uses 11pt body text, a slightly narrower reading width,
and regular section/entry spacing. Page one carries the introduction, skills,
publications and the current Armada role; page two starts with earlier roles
and continues through projects, education and achievements. Keep roles intact
at that page boundary. Dates and project links occupy a consistent right-hand
slot, while managers and advisors remain secondary lines. Browser print uses
the full page measure instead of inheriting the website paragraph-width cap.
Whitespace is reserved between sections and at page edges, rather than created
by undersized body text. Do not add content solely to fill the page.

## Portrait treatment — 26 October 2026

The website portrait uses the existing photo with CSS grayscale, a one-pixel
page-rule border, two-pixel corners and a small inset. The crop stays aligned
with the introduction at each breakpoint. No motion or hover effect is added
to a non-interactive image. Light/dark themes and doubled text were checked at
320, 390, 768, 801, 1280 and 1440px, with no image/text overlap.
