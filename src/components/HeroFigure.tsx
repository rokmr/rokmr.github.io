import { useFlowFigure } from '../hooks/useFlowFigure';
import type { TargetSpec } from '../lib/flow/targets';

/**
 * Figure 1: flow matching, live. Gaussian noise on one side travels along
 * straight lines to the target picture on the other. The slider along the
 * bottom of the plot is the time axis; the cloud can also be dragged.
 */
export function HeroFigure({ target }: { target: TargetSpec }) {
  const { canvasRef, sliderRef, playing, toggle } = useFlowFigure(target);

  return (
    <figure className="flow-figure">
      <div className="flow-figure__plot">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Flow matching: a Gaussian noise cloud travels along straight lines to a stippled picture of ${target.label}, the data distribution.`}
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

      {/* One <figcaption> (it must be the figure's last child) laid out on the
          page grid: the caption in the main column, a legend for the marks in
          the margin column. */}
      <figcaption className="flow-figure__foot l-margin">
        <p className="flow-figure__caption">
          <strong>Figure 1.</strong> Flow matching trains a network to move each noise sample in a
          straight line to the data: x<sub>t</sub> = (1 − t)·x<sub>0</sub> + t·x<sub>1</sub>. Here
          the data is a stippled portrait of {target.label}.
        </p>
        <dl className="meta">
          <div className="meta__row">
            <dt className="meta__label">Rings</dt>
            <dd className="meta__value">
              <Swatch kind="ring" />1σ and 2σ of the noise</dd>
          </div>
          <div className="meta__row">
            <dt className="meta__label">Rays</dt>
            <dd className="meta__value">
              <Swatch kind="ray" />
              A pair's path, x<sub>0</sub> → x<sub>1</sub>
            </dd>
          </div>
          <div className="meta__row">
            <dt className="meta__label">Arrows</dt>
            <dd className="meta__value">
              <Swatch kind="arrow" />
              A sample moving at x<sub>1</sub> − x<sub>0</sub>
            </dd>
          </div>
        </dl>
      </figcaption>
    </figure>
  );
}

/** Legend glyphs drawn to match the canvas marks. */
function Swatch({ kind }: { kind: 'ring' | 'ray' | 'arrow' }) {
  return (
    <svg className="flow-figure__swatch" viewBox="0 0 18 10" width="18" height="10" aria-hidden="true">
      {kind === 'ring' && (
        <circle cx="9" cy="5" r="4" fill="none" stroke="currentColor" strokeDasharray="2 2" />
      )}
      {kind === 'ray' && (
        <line x1="1" y1="5" x2="17" y2="5" stroke="var(--ink-accent)" strokeDasharray="2 3" />
      )}
      {kind === 'arrow' && (
        <>
          <line x1="1" y1="5" x2="12" y2="5" stroke="var(--ink-accent)" strokeWidth="1.2" />
          <path d="M17 5l-6-3.5v7z" fill="var(--ink-accent)" />
        </>
      )}
    </svg>
  );
}
