import { useCallback, useEffect, useRef, useState } from 'react';
import { mountFlowFigure, type FlowFigure } from '../lib/flow/controller';
import type { TargetSpec } from '../lib/flow/targets';

/**
 * React binding for the flow-matching figure.
 *
 * Time `t` changes every animation frame, so it never enters React state: the
 * slider is written imperatively and the page does not re-render at 60 Hz.
 * React state holds only play/pause.
 *
 * The slider is the figure's time axis. On a side-by-side layout its ends are
 * pinned under the noise and data centres through two CSS custom properties
 * on the plot, `--axis-start` and `--axis-end`, so the thumb sits under the
 * moving cloud.
 *
 * `target` must be referentially stable (a module constant); a new object
 * remounts the figure.
 */
export function useFlowFigure(target: TargetSpec) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gpuCanvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const figureRef = useRef<FlowFigure | null>(null);
  // Prerendered markup shows the pause control; reduced-motion readers flip
  // it on mount, which is a single re-render.
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const slider = sliderRef.current;
    const plot = canvas?.parentElement;
    if (!canvas || !slider || !plot) return;

    // Reduced motion: no autoplay, open on the finished picture. Scrubbing
    // still works — it is motion the reader starts.
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = motion.matches;

    const figure = mountFlowFigure({
      canvas,
      gpuCanvas: gpuCanvasRef.current ?? undefined,
      target,
      autoplay: !reduced,
      initialT: reduced ? 1 : 0,
      onPlayingChange: setPlaying,
      onFrame: (t) => {
        slider.value = String(t);
        slider.setAttribute('aria-valuetext', `t = ${t.toFixed(2)}`);
      },
      onLayout: (g) => {
        plot.dataset.orientation = g.vertical ? 'vertical' : 'horizontal';
        plot.style.setProperty('--axis-start', `${g.ax}px`);
        plot.style.setProperty('--axis-end', `${g.w - g.bx}px`);
      },
    });
    figureRef.current = figure;
    if (reduced) setPlaying(false);

    const onInput = () => figure.setT(Number(slider.value));
    const onMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) figure.pause();
    };
    slider.addEventListener('input', onInput);
    motion.addEventListener('change', onMotionChange);

    return () => {
      slider.removeEventListener('input', onInput);
      motion.removeEventListener('change', onMotionChange);
      figure.destroy();
      figureRef.current = null;
    };
  }, [target]);

  const toggle = useCallback(() => {
    const figure = figureRef.current;
    if (!figure) return;
    if (playing) figure.pause();
    else figure.play();
  }, [playing]);

  return { canvasRef, gpuCanvasRef, sliderRef, playing, toggle };
}
