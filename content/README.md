# Career content foundation

The public website and printable résumé share the records in `src/data/`.
The local master now contains 37 structured records, synchronized with confirmed
public content. The complete supplied briefing and subsequent corrections are
preserved in a separate private portable profile. Full private-history
structuring remains incremental; the homepage is intentionally curated.

## Files and responsibilities

| File | Purpose |
| --- | --- |
| `private/master.json` | Local master for detailed facts, internal context, pending claims, and tailored résumé selections. Git-ignored and never imported into the website. |
| `private/portable-profile.md` | Complete private agent briefing, preserving original history, confidentiality rules and later corrections. Git-ignored; never bundled. |
| `master.schema.json` | Portable JSON Schema describing the records. The local master points its editor at this schema. |
| `master.template.json` | Checked-in starter containing existing public role facts, empty preferences, and empty selections for two résumé directions. |
| `generated/public-profile.json` | Explicit public projection for review. It is outside `public/` and `src/` and supplies identity and role metadata to website adapters. |
| `../scripts/content.mjs` | Initialization, schema/reference checks, and public projection. |

The master is intentionally ordinary JSON: future TypeScript website adapters,
Python/LaTeX résumé tooling, and other renderers can use it without depending on
React or a particular résumé template. Formatting belongs to those renderers.

`private/` is local storage, not an encrypted vault or a backup. Keep its backup
in a private location of your choosing. Never import this directory into browser
code or move it into `public/`.

## Commands

```sh
npm run content:init    # Create a master on a fresh checkout; refuses overwrite
npm run content:check   # Check local master, or explicitly report template fallback
npm run content:export  # Generate the public review projection from the local master
npm run content:test   # Exercise references, chronology, and export boundaries
```

The normal website build does not read the private master, so CI remains
reproducible without personal or internal notes. Exporting updates the reviewed public JSON consumed by website adapters. It
does not deploy the site or generate a résumé.

## One fact record, several views

Each record has a stable ID, kind, ownership, lifecycle status, partial dates,
public-facing content, technologies, links, sources, and private notes.
`null` means unknown; do not invent exact dates or numerical results.

Relationship example:

```text
armada                         employment
  armada-support               project
    support-retrieval          contribution
    support-evaluation         contribution
  armada-almanac               project
    almanac-document-parsing    contribution
```

Add to an existing project when work improves that system. Create a new project
when it has a distinct problem and outcome. Contributions can grow without
adding a card to the homepage. Never renumber IDs to change display order.

`views.website.recordIds` selects approved public records. `featuredWorkIds`
selects the smaller homepage subset. `views.resumes` holds ordered record-ID
selections for job-specific variants; facts are not copied into each variant.
Résumé selections may reference private records for local drafting, but that
is not permission to share their contents in an external résumé.

## Facts, uncertainty, and publication

- `visibility: public` means the record's explicitly public-facing fields can
  be selected for the public projection.
- `needs-review` is the default for newly supplied internal work. It is never
  exported until reviewed and selected.
- `private` preserves interview context, internal documents, and sensitive
  details without treating them as website content.
- `privateNotes`, sources, inbox notes, preferences, alternative email
  addresses, and résumé selections are excluded by the export's field allowlist,
  even when the surrounding record is public.
- Metrics have independent visibility plus baseline, sample, measurement date,
  context, limitations, and source fields. Public metrics need a numeric value,
  context, and a source. Preserve relevant baseline/sample limitations in public
  wording; a number alone is not a useful claim.
- Public children must have their selected public parent present. Unknown IDs,
  hierarchy cycles, unsupported fields, and inconsistent dates fail checks.

A role's ownership does not imply ownership of every project. Keep contributed,
end-to-end-owned, and sole-engineering-owned work distinct. Record shipped,
undeployed, exploratory, and ongoing work honestly. Document-processing quality
must not be presented as measured end-to-end answer quality. Blind hard-case
pass rates must retain their evaluation-set context.

## Migration and delivery order

1. Finish collecting Rohit's remaining notes into the local master/inbox.
2. Structure roles, projects, contributions, publications, education, service,
   achievements, and skills. Preserve evidence and unresolved questions.
3. Review public wording and select homepage highlights. Existing `src/data/`
   still supplies detailed project and role copy during the staged migration.
4. Extend `src/data/profile.ts`: identity and role identity are connected now.
   Detailed case studies, education, publications, and SEO still need migration
   into the same reviewed projection.
5. Establish one actual page registry for routing, canonical URLs, and sitemap
   generation. Adding a contribution does not automatically create a route.
   Use genuine content-change dates; do not fabricate `lastmod` on every build.
6. Add a local résumé projection and LaTeX renderer with escaping, page-layout
   verification, and separate selections for applied AI and computer vision.
   Internal reports remain internal; do not imply public publication.

Routes now generate static case-study pages and the deployed sitemap. The
printable résumé is at `/resume/`; a separate two-page LaTeX PDF is available at
`/assets/Rohit-Kumar-Resume.pdf`. Rebuild it with `npm run resume:pdf`
(Tectonic required); the generator reads the same public data as `/resume/`. The portable profile retains older benchmarks as dated snapshots,
not automatic permission to publish them. New public-record selections include
reviewed ownership, fine-tuning, quantization, publications, education and skills;
unapproved metrics and the internal technical report remain excluded.

## Résumé selection principle

New notes enrich the master record; recency alone must not give them résumé
prominence. Keep the general résumé balanced across applied AI, computer vision,
diffusion, research and engineering. Put narrow method lists such as AWQ/GPTQ
and weight/activation formats in relevant project details. Select highlights
for demonstrated ownership, problem solving and evidence; tailor emphasis to a
specific role only when requested.

Résumé composition updated at Rohit's request: Summary, Skills, Publications,
Experience, Projects, Education, Achievements. Publications appear on page one
alongside the current Armada role. The résumé uses asterisks on both confirmed
equal-contributor author pairs and one shared explanation. This résumé display
convention does not change the published papers' author-marker metadata.

## Targeted résumé generation

- `npm run resume:pdf`: two-page, publication-first public résumé; copies the
  verified artifact into `public/assets/Rohit-Kumar-Resume.pdf`.
- `npm run resume:pdf:applied`: one-page applied-AI draft, experience first,
  generated only under ignored `output/pdf/Rohit-Kumar-Applied-AI.pdf`.

Both read reviewed public data and share the same role facts, paper summaries
and historical evidence. The applied draft selects fewer roles/credentials; it
does not delete anything from the master record or replace the public default.
Historical planner figures must retain their version and hardware qualification.
New validation results require a separate evidence record; the old figures must
not be relabeled as accuracy for an expanded model/workload scope.
