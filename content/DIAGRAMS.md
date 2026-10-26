# Technical diagram design system

The portfolio uses code-native diagrams that explain a specific technical idea.
They are not project thumbnails, deployment guarantees, or decoration.

## Implementation

- `src/data/diagrams.ts`: typed, public diagram content and case-study placement.
- `src/components/TechnicalDiagram.tsx`: semantic figure, named lanes, ordered
  stages, shared SVG direction connectors, explicit inter-lane relationships and caption. Reusable instances get distinct IDs.
- `src/styles/components/technical-diagram.css`: tokens and responsive composition.
- `CaseStudy.tsx`: inserts a diagram after its explicitly named supporting section.

The first patterns explain Support Agent question answering, Almanac document
and question paths, and inference-planning decisions followed by hands-on deployment. They use already approved
public scope. No internal addresses, hardware topology or new metrics are added.

## Grammar

| Element | Meaning | Treatment |
| --- | --- | --- |
| Input | Material supplied to the flow | Neutral stage with explicit role label |
| Process | A transformation or operation | Same neutral stage |
| Store | Indexed/persisted information | Double top rule and Store label |
| Check | Evaluation or comparison | Accent border and Check label; does not imply success |
| Output | The flow's described result | Subtle neutral fill and Output label |
| Arrow | Information moves to the next stage | One forward arrow per adjacent pair |
| Lane | A named sequence | Caption above an ordered list |
| Relationship | One lane supplies another, or work changes ownership | Named source and destination connected by a shared arrow, with a relationship label |
| Figure caption | Scope and omitted relationships | Always visible under the diagram |

Labels carry meaning without color. Green is not used to imply that ongoing
quality work has passed. Node role is independent of the technologies used.

## Visual rules

- Inherit portfolio ink, paper, muted text, accent, wash and rule colors.
- Shared tokens govern gap (1.75rem), radius, border weight and palette. Stage
  padding uses the shared spacing scale. Keep a single visual weight.
- Figure title 1rem; stage title .875rem; description and caption .8125rem;
  role .75rem. Captions use the same sans-serif family as body copy.
  Titles describe operations or artifacts. Descriptions add context rather than
  repeating the title or listing every dependency.
- Connectors use a 1.5-unit stroke and an open arrowhead, centered between stages.
  No northeast link arrows, decorative dotted paths, flow particles or pulsing.
- Space belongs to the content. No fixed canvas height or oversized export image.
  Never shrink labels to force a diagram into a narrow column.

## Responsive composition

Four-stage sequences fit across a normal case-study reading column. At 37.5rem
of available diagram width or less, the same sequence becomes a vertical list;
arrows rotate down and role labels move beside the stage content. Five-stage
sequences make this transition earlier, at 46.25rem. Rem-based thresholds respond
to larger browser font preferences as well as a smaller window.

Sequences never snake across wrapped rows: that creates an ambiguous reading
order. Multiple lanes retain their reading order in both orientations. Almanac's
explicit relationship names the knowledge index and the retrieval stage it
supplies. Inference planning has a separate engineering lane connected by an
explicit handoff. Neither connection implies an automatic deployment API or
a network topology. Connections reference existing lane/stage IDs in data.

## Accessibility and behavior

Figures have a named title, native figcaption and real text. Ordered stage lists
provide the reading order without requiring a graphical interpretation. Arrows
are decorative and excluded from the accessibility tree. No hover-only details,
canvas text, diagram-specific keyboard controls, animations, or JavaScript
measurement are needed. Server rendering and no-JavaScript reading work.

Print uses neutral rules; text and captions remain available. Browser captures
are reviewed in both themes. `npm run test:design` checks 96 diagram states for
connector placement, text clipping, 12px minimum labels, caption family, role
shading and text contrast. This complements visual review; it does not establish
every browser or assistive-technology configuration.

## Adding a diagram

Add a `TechnicalDiagramSpec` in `technicalDiagrams`. Select a real case-study ID
and an exact `afterSection` heading. Give each lane/stage a stable ID. Use a
caption that says what was simplified. A diagram should answer a question its
neighboring prose raises, not repeat a technology list.

Use the current component for ordered flows and explicitly linked lanes.
Branches, feedback loops and physical deployment boundaries need a pattern with
validated relationships; do not draw them by improvising arrows around a
sequence. Prefer a smaller, truthful explanation over a speculative system map.

## Streamline icon vocabulary

Stage symbols use a selected subset of Streamline Core Line, from Streamline's
official `webalys-hq/streamline-vectors` repository (CC BY 4.0). Each stage names
its icon explicitly: questions, documents, editing, search, filtering, layers,
storage, compute, configuration and deployment. Do not use generic sparkle
icons to stand in for all AI operations.

`DiagramIcon.tsx` references the locally hosted symbol sprite at
`public/assets/icons/streamline-core.svg`. The 14-unit originals are scaled to
a 24-unit viewBox with matching outline weight and currentColor. Text remains
primary; symbols are decorative, non-focusable and do not introduce new claims.

License, source-file links and adaptation notes are in
`public/assets/icons/STREAMLINE-LICENSE.md`. Diagram pages show Streamline and
CC BY credits in their footer; print retains these credits. No icon font, remote
rendering service or full icon-library dependency is loaded.

`npm run test:design` verifies that each referenced symbol actually renders.
Unit tests check symbol availability and visible case-study attribution.
