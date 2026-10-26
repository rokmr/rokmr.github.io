import { Fragment, useId, type CSSProperties } from 'react';
import { Icon } from './Icon';
import { DiagramIcon } from './DiagramIcon';
import type { TechnicalDiagramSpec, DiagramStageKind } from '../data/diagrams';

const stageLabels: Record<DiagramStageKind, string> = {
  input: 'Input', process: 'Process', store: 'Store', check: 'Check', output: 'Output',
};

/** Text supplies the reading order; arrows explain direction without becoming controls. */
export function TechnicalDiagram({ diagram }: { diagram: TechnicalDiagramSpec }) {
  const instanceId = `${diagram.id}-${useId()}`;
  const titleId = `${instanceId}-title`;
  const captionId = `${instanceId}-caption`;
  return (
    <figure className="technical-diagram" aria-labelledby={titleId} aria-describedby={captionId}>
      <div className="diagram-heading">
        <h3 id={titleId}>{diagram.title}</h3>
        <span>Workflow overview</span>
      </div>
      <div className="diagram-lanes">
        {diagram.lanes.map(lane => (
          <Fragment key={lane.id}>
            <div className="diagram-lane">
              <p className="diagram-lane-label" id={`${instanceId}-${lane.id}`}>{lane.label}</p>
              <ol role="list" className={`diagram-flow${lane.stages.length > 4 ? ' diagram-flow--long' : ''}`} aria-labelledby={`${instanceId}-${lane.id}`} style={{ '--diagram-columns': lane.stages.length } as CSSProperties}>
                {lane.stages.map((stage, index) => (
                  <li className={`diagram-stage diagram-stage--${stage.kind}`} key={stage.id}>
                    <span className="diagram-stage-kind"><DiagramIcon name={stage.icon} /><span>{stageLabels[stage.kind]}</span></span>
                    <p className="diagram-stage-title">{stage.title}</p>
                    <p className="diagram-stage-detail">{stage.detail}</p>
                    {index < lane.stages.length - 1 && <Icon name="arrowRight" className="diagram-connector" />}
                  </li>
                ))}
              </ol>
            </div>
            {diagram.connections?.filter(connection => connection.fromLane === lane.id).map(connection => {
              const from = lane.stages.find(stage => stage.id === connection.fromStage)!;
              const to = diagram.lanes.find(target => target.id === connection.toLane)!.stages.find(stage => stage.id === connection.toStage)!;
              return <div className="diagram-relationship" key={`${connection.fromStage}-${connection.toStage}`}>
                <p className="diagram-relationship-label">{connection.label}</p>
                <p className="diagram-relationship-path"><span>{from.title}</span><Icon name="arrowRight" /><span>{to.title}</span></p>
              </div>;
            })}
          </Fragment>
        ))}
      </div>
      <figcaption id={captionId}>{diagram.caption}</figcaption>
    </figure>
  );
}
