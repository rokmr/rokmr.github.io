# Technical diagram design system

The portfolio uses code-native diagrams that explain a specific technical idea.
They are not project thumbnails, deployment guarantees, or decoration.

## Implementation

- `src/data/diagrams.ts`: typed, public diagram content and case-study placement.
- `src/components/TechnicalDiagram.tsx`: semantic figure, named lanes, ordered
  stages, direction connectors and caption. Reusable instances get distinct IDs.
- `src/styles/components/technical-diagram.css`: tokens and responsive composition.
- `CaseStudy.tsx`: inserts a diagram after its explicitly named supporting section.

The first patterns explain Support Agent question answering, Almanac document
and question paths, and inference-planning decisions. They use already approved
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
| Figure caption | Scope and omitted relationships | Always visible under the diagram |

Labels carry meaning without color. Green is not used to imply that ongoing
quality work has passed. Node role is independent of the technologies used.

## Visual rules

- Inherit portfolio ink, paper, muted text, accent, wash and rule colors.
- Diagram-local tokens govern gap (28px), radius (3px), border (1px), connector
  ink and border ink. Stage padding is 12px. Keep a single visual weight.
- Figure title 1rem; stage title .8125rem; description .75rem; role .625rem.
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
order. Multiple lanes remain separate sequences in both orientations. Almanac's
caption explains the index-to-retrieval relationship; it is not silently omitted
or represented as an invented cross-lane production connection.

## Accessibility and behavior

Figures have a named title, native figcaption and real text. Ordered stage lists
provide the reading order without requiring a graphical interpretation. Arrows
are decorative and excluded from the accessibility tree. No hover-only details,
canvas text, diagram-specific keyboard controls, animations, or JavaScript
measurement are needed. Server rendering and no-JavaScript reading work.

Print uses neutral rules; text and captions remain available. Full browser and
print visual verification is still required; source and structural tests are
not a visual sign-off.

## Adding a diagram

Add a `TechnicalDiagramSpec` in `technicalDiagrams`. Select a real case-study ID
and an exact `afterSection` heading. Give each lane/stage a stable ID. Use a
caption that says what was simplified. A diagram should answer a question its
neighboring prose raises, not repeat a technology list.

Use the current component for ordered flows and named parallel flows. Branches,
feedback loops and deployment boundaries need an explicit new pattern with
validated relationships; do not draw them by improvising arrows around a
sequence. Prefer a smaller, truthful explanation over a speculative system map.
