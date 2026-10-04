import { useEffect, useRef } from 'react';
import {
  buildVectorField,
  createParticles,
  drawFrame,
  measureViewport,
  particleBudget,
  type Viewport,
} from '../lib/flowField';

export type HudRefs = {
  time: React.RefObject<HTMLDivElement>;
  step: React.RefObject<HTMLDivElement>;
  noise: React.RefObject<HTMLDivElement>;
  progress: React.RefObject<HTMLDivElement>;
  terminal: React.RefObject<HTMLDivElement>;
  panel: React.RefObject<HTMLDivElement>;
};

/**
 * Drives the hero canvas and writes the HUD readouts imperatively.
 *
 * The HUD updates every frame, so it deliberately bypasses React state — 60
 * setState calls a second would re-render the whole page for four text nodes.
 */
export function useFlowCanvas(hud: HudRefs) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let view: Viewport = measureViewport(window.innerWidth, window.innerHeight);
    let budget = particleBudget(window.innerWidth);
    let particles = createParticles(budget);
    let vectorField = buildVectorField(particles);

    const applyViewport = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      view = measureViewport(window.innerWidth, window.innerHeight);
    };
    applyViewport();

    // Readers with reduced-motion preference get the resolved butterfly, once.
    if (reduceMotion) {
      drawFrame(ctx, view, particles, vectorField, 1, 1);
      const onResizeStatic = () => {
        applyViewport();
        drawFrame(ctx, view, particles, vectorField, 1, 1);
      };
      window.addEventListener('resize', onResizeStatic);
      return () => window.removeEventListener('resize', onResizeStatic);
    }

    let t = 0.8;
    let targetT = 0.8;
    let lastMouseMove = Date.now();
    let pauseUntil = 0;
    let lastFrameTime = performance.now();
    let autoPlay = true;
    let loopBackTimer: number | undefined;
    let frame = 0;

    const onPointerMove = (e: MouseEvent) => {
      targetT = Math.max(0, Math.min(1, e.clientX / view.w));
      lastMouseMove = Date.now();
    };

    // Re-seeding on resize keeps the particle budget matched to the viewport
    // when a phone rotates or a desktop window is dragged across breakpoints.
    let resizeTimer: number | undefined;
    const onResize = () => {
      applyViewport();
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const next = particleBudget(window.innerWidth);
        if (next !== budget) {
          budget = next;
          particles = createParticles(budget);
          vectorField = buildVectorField(particles);
        }
      }, 200);
    };

    const animate = () => {
      const now = performance.now();
      const dt = (now - lastFrameTime) / 1000;
      lastFrameTime = now;

      const idleTime = Date.now() - lastMouseMove;
      if ((autoPlay || idleTime > 3000) && Date.now() >= pauseUntil) {
        targetT += dt * 0.04; // 0.8 → 1.0 over ~5s
        if (targetT >= 1) {
          targetT = 1;
          autoPlay = false;
          pauseUntil = Date.now() + 5000;
          loopBackTimer = window.setTimeout(() => {
            targetT = 0.8;
          }, 5000);
        }
      }

      t += (targetT - t) * 0.06;

      const opacity = Math.max(0, 1 - window.scrollY / window.innerHeight);
      drawFrame(ctx, view, particles, vectorField, t, opacity);

      if (hud.time.current) hud.time.current.textContent = `t = ${t.toFixed(2)} `;
      if (hud.step.current) hud.step.current.textContent = `${Math.round(t * 49) + 1}/50`;
      if (hud.noise.current) hud.noise.current.textContent = (1 - t).toFixed(2);
      if (hud.progress.current) hud.progress.current.style.width = `${t * 100}%`;
      if (hud.terminal.current) hud.terminal.current.style.opacity = String(opacity);
      // pointer-events is left to CSS: the panel is a decorative readout with
      // no controls, so it must never swallow a tap on the content beneath it.
      if (hud.panel.current) hud.panel.current.style.opacity = String(opacity);

      frame = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onPointerMove);
    window.addEventListener('resize', onResize);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(loopBackTimer);
      window.clearTimeout(resizeTimer);
      document.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', onResize);
    };
  }, [hud]);

  return canvasRef;
}
