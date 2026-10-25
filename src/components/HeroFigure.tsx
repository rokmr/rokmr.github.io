import { useFlowFigure } from '../hooks/useFlowFigure';
import type { TargetSpec } from '../lib/flow/targets';

/**
 * Figure 1: flow matching, live. Samples leave the noise on one side and
 * travel in straight lines to the target picture on the other, a spread of
 * them carrying arrows for their velocity. Every dot is a sample; the dashed
 * rings mark where they start and the labels name both ends. The slider along
 * the bottom of the plot is the time axis; the cloud can also be dragged.
 */
export function HeroFigure({ target }: { target: TargetSpec }) {
  const { canvasRef, gpuCanvasRef, sliderRef, playing, toggle } = useFlowFigure(target);

  return (
    <figure className="flow-figure">
      <div className="flow-figure__heading">
        <span className="label">Interactive / Flow matching</span>
        <span className="flow-figure__hint">Drag to explore</span>
      </div>
      <div className="flow-figure__plot">
        {/* The samples render on the GPU underneath; rings, arrows, labels and
            pointer input live on the canvas above. */}
        <canvas ref={gpuCanvasRef} className="flow-figure__gpu" aria-hidden="true" />
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Flow matching: samples travel in straight lines, with arrows showing their direction, from a Gaussian noise cloud to a stippled picture of ${target.label}, the data distribution.`}
        />
        <div className="flow-figure__axis">
          <div className="flow-figure__axis-start">
            <button
              type="button"
              className="flow-figure__play"
              onClick={toggle}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <path d={playing ? 'M4 3h3v10H4zM9 3h3v10H9z' : 'M4.5 2.5v11l9-5.5z'} fill="currentColor" />
              </svg>
            </button>
            <span aria-hidden="true">t=0</span>
          </div>
          <input
            ref={sliderRef}
            className="flow-figure__slider"
            type="range"
            min="0"
            max="1"
            step="0.001"
            defaultValue="0"
            aria-label="Time t, from noise (0) to data (1)"
          />
          <span className="flow-figure__axis-end" aria-hidden="true">
            t=1
          </span>
        </div>
      </div>

      <figcaption className="flow-figure__foot">
        <p className="flow-figure__caption">
          Noise → image. Each point follows a straight path from a random starting
          position to a portrait of {target.label}. A small illustration of flow matching.
        </p>
        <details className="flow-figure__notes">
          <summary>About this illustration</summary>
          <p>
            Flow matching learns a velocity field that transports noise toward data.
            Here, paired starting and ending points illustrate the interpolation:
            x<sub>t</sub> = (1 − t)x<sub>0</sub> + tx<sub>1</sub>.
            The arrows show travel direction; the dashed rings mark starting positions.
          </p>
        </details>
      </figcaption>
    </figure>
  );
}
