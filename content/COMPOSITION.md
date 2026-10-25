# Portfolio composition

Audience: recruiters for applied AI/LLM roles first, alongside research
collaborators and freelance clients. Computer vision/diffusion is a second
specialism supported by real work and publications.

## Story and section contracts

| Chapter | Visitor question | Content contract |
| --- | --- | --- |
| Introduction | Who is Rohit, and is his work relevant? | Identity, expertise, one qualification line, work/contact actions. No second project index. |
| Research | What distinguishes his technical background? | Publications appear immediately after the introduction. Papers, contributions, resources and service establish research depth. |
| Selected work | What has he built? | A curated set of three examples with problem, personal contribution, outcome and inspectable evidence. |
| Experience | What responsibilities has he held? | Roles, dates, scope and additional outcomes. Capabilities support this chapter. |
| Background | How did he arrive here? | Short personal path, education, secondary achievements. No second employer summary. |
| Contact | How could we work together? | Explicit roles/collaboration/project invitation and direct contact. |

`src/data/site.ts` owns the section order and numbering. `Home.tsx` maps that
registry to components. `#skills` and `#education` remain valid anchors within
their parent chapters. A render test checks the chapter sequence.

## Curation and growth

Adding work to the master does not add a homepage card. The public project
projection is still being migrated; the current explicit selection lives in
`featuredProjectIds` in `src/data/projects.ts`. It contains production RAG,
image generation, and a public video-classification project. TACLE belongs to
Research instead of appearing twice in the project gallery. Additional projects
remain available through a quieter expandable list.

Eventually the master view's `featuredWorkIds` will replace this temporary
selection when the project records have been reviewed and exported. Do not
publish the detailed private Armada records merely to make this migration easy.

For ongoing Armada work, retain one employment record, separate project records,
and contribution records underneath each project. Curate the newest meaningful
contributions into existing case studies; do not append a new card for each
implementation improvement.

## Composition rules

- Desktop: a fixed left navigation rail provides persistent section access and
  a current-location marker. Research follows the introduction. Content layout
  responds to the space remaining after the rail; below that threshold, the
  navigation becomes a compact header and drawer.
- Tablet: stack before the introduction or case-study text becomes cramped.
- Phone: identity, explanation, action, then evidence, in document order. Do not
  rely on hover to reveal diagrams or controls.
- Keep the diagram inspectable at its full size. A schematic is evidence of
  architecture, not a fabricated product-output image.
- Case-study outcomes must preserve the metric's baseline and limitations.
  Never promote a benchmark figure to production adoption or resolution impact.
- Component headings, icon sizes and link treatments share the existing tokens.
  Secondary achievements are compact; production work has the most space.

## Next section review

Review Introduction and Selected Work together first: they form one opening
sequence. Research has priority immediately after the introduction; review its transition
into Selected Work, then Experience, Background, and Contact.
For each, review content purpose, actual contribution evidence, responsive
composition, keyboard/touch interactions, and a rendered visual check. Changes
should improve that chapter without duplicating another chapter's job.

## Current data boundary

`content/generated/public-profile.json` now supplies public identity and role
identity to website adapters. Detailed work descriptions remain in legacy typed
files while migration continues. The local master has initial contribution
records with metric context and ownership distinctions. Website, SEO and résumé
projections are not yet fully unified. No LaTeX renderer or new project routes
have been introduced in this composition pass.
