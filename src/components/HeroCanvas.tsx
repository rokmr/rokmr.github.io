import { useMemo, useRef } from 'react';
import { useFlowCanvas, type HudRefs } from '../hooks/useFlowCanvas';
import { useTypewriter } from '../hooks/useTypewriter';
import { terminalMessages } from '../data/site';

/**
 * The canvas, the flow-matching HUD and the boot terminal. These three are one
 * component because the animation loop writes all of them every frame.
 */
export function HeroCanvas() {
  const time = useRef<HTMLDivElement>(null);
  const step = useRef<HTMLDivElement>(null);
  const noise = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const terminal = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const hud: HudRefs = useMemo(
    () => ({ time, step, noise, progress, terminal, panel }),
    [],
  );

  const canvasRef = useFlowCanvas(hud);
  const terminalText = useTypewriter(terminalMessages);

  return (
    <>
      <canvas id="flow-canvas" ref={canvasRef} aria-hidden="true" />

      <div className="control-panel" ref={panel} aria-hidden="true">
        <div className="control-group">
          <div className="control-label">STEP</div>
          <div className="control-value" ref={step}>
            0/50
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" ref={progress} />
        </div>
        <div className="timestep" ref={time}>
          t=0.00
        </div>
        <div className="control-group">
          <div className="control-label">NOISE</div>
          <div className="control-value" ref={noise}>
            1.00
          </div>
        </div>
      </div>

      <div className="terminal-init" ref={terminal} aria-hidden="true">
        <span className="terminal-text">{terminalText}</span>
        <span className="terminal-cursor">▋</span>
      </div>
    </>
  );
}
