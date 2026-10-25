import { useId, type CSSProperties } from 'react';
import type { TechnicalDiagramSpec, DiagramStageKind } from '../data/diagrams';

const stageLabels: Record<DiagramStageKind, string> = {
  input: 'Input', process: 'Process', store: 'Store', check: 'Check', output: 'Output',
};

/** Semantic content is server-rendered; CSS changes the same sequence's layout. */
export function TechnicalDiagram({ diagram }: { diagram: TechnicalDiagramSpec }) {
  const instanceId = `${diagram.id}-${useId()}`;
  const titleId = `${instanceId}-title`;
  return (
    <figure className="technical-diagram" aria-labelledby={titleId}>
      <div className="diagram-heading">
        <h3 id={titleId}>{diagram.title}</h3>
        <span>Conceptual flow</span>
      </div>
      <div className="diagram-lanes">
        {diagram.lanes.map(lane => (
          <div className="diagram-lane" key={lane.id}>
            <p className="diagram-lane-label" id={`${instanceId}-${lane.id}`}>{lane.label}</p>
            <ol role="list" className={`diagram-flow${lane.stages.length > 4 ? ' diagram-flow--long' : ''}`} aria-labelledby={`${instanceId}-${lane.id}`} style={{ '--diagram-columns': lane.stages.length } as CSSProperties}>
              {lane.stages.map((stage, index) => (
                <li className={`diagram-stage diagram-stage--${stage.kind}`} key={stage.id}>
                  <span className="diagram-stage-kind">{stageLabels[stage.kind]}</span>
                  <p className="diagram-stage-title">{stage.title}</p>
                  <p className="diagram-stage-detail">{stage.detail}</p>
                  {index < lane.stages.length - 1 && (
                    <svg className="diagram-connector" width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M3 12h18m-6-6 6 6-6 6" /></svg>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  );
}
