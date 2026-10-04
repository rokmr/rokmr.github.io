// Mounts the flow-matching figure on a canvas and runs it. Framework-agnostic:
// React (or anything else) creates it, listens through callbacks and calls
// destroy() on unmount.

import { measureGeometry, particleBudget, tFromPoint, type Geometry } from './geometry';
import { readPalette } from './palette';
import { createParticles, type Particles } from './particles';
import { drawFrame, drawStatic } from './render';
import { sampleTarget, type TargetSpec } from './targets';
import { CYCLE, phaseForT, tAtPhase } from './timeline';

export type FlowFigureOptions = {
  canvas: HTMLCanvasElement;
  target: TargetSpec;
  /** Start playing on mount. */
  autoplay: boolean;
  /** Time to show before anything plays, in [0, 1]. */
  initialT: number;
  /** Called after every drawn frame with the time shown. */
  onFrame?: (t: number) => void;
  /** Called when the layout changes, so overlaid controls can line up with it. */
  onLayout?: (geometry: Geometry) => void;
  onPlayingChange?: (playing: boolean) => void;
};

export type FlowFigure = {
  play(): void;
  pause(): void;
  /** Shows time `t` and pauses — the reader has taken over. */
  setT(t: number): void;
  destroy(): void;
};

/** A 3x phone would fill 9x the pixels of 1x for no visible gain. */
const MAX_DPR = 2;
/** Longest step the loop takes, so a stalled tab does not jump the cycle. */
const MAX_DT = 0.05;

export function mountFlowFigure(opts: FlowFigureOptions): FlowFigure {
  const { canvas, target } = opts;
  const ctx = canvas.getContext('2d');
  const layer = document.createElement('canvas');
  const layerCtx = layer.getContext('2d');
  if (!ctx || !layerCtx) return { play() {}, pause() {}, setT() {}, destroy() {} };

  const palette = readPalette(canvas);
  let geo: Geometry = measureGeometry(1, 1);
  let dpr = 1;
  let particles: Particles | null = null;
  let label = target.label;
  let budget = 0;
  let loadId = 0;
  let destroyed = false;

  let t = clamp01(opts.initialT);
  let phase = phaseForT(t);
  let playing = false;
  let onScreen = true;
  let pageVisible = !document.hidden;
  let frame = 0;
  let last = 0;

  // ---- drawing ------------------------------------------------------------

  const render = () => {
    drawFrame(ctx, geo, layer, particles, t, palette);
    opts.onFrame?.(t);
  };

  const paintLayer = () => {
    layer.width = canvas.width;
    layer.height = canvas.height;
    layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawStatic(layerCtx, geo, particles, palette, label);
    render();
  };

  // ---- data ---------------------------------------------------------------

  const load = async (count: number) => {
    // A resize can start a second load before the first resolves; only the
    // latest may install its particles, or a slow image decode would land
    // stale data over a fresh draw.
    const id = ++loadId;
    const result = await sampleTarget(target, count);
    if (destroyed || id !== loadId) return;
    particles = createParticles(result.points);
    label = result.label;
    paintLayer();
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    // Assigning canvas.width clears it even when unchanged; skip no-op resizes.
    if (width === canvas.width && height === canvas.height && geo.w === rect.width) return;
    canvas.width = width;
    canvas.height = height;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    geo = measureGeometry(rect.width, rect.height);
    opts.onLayout?.(geo);

    const next = particleBudget(rect.width, rect.height);
    if (next !== budget) {
      budget = next;
      void load(next);
    }
    paintLayer();
  };

  // ---- playback -----------------------------------------------------------

  const canRun = () => playing && onScreen && pageVisible && !destroyed;

  const loop = (now: number) => {
    frame = 0;
    if (!canRun()) return;
    const dt = last ? Math.min(MAX_DT, (now - last) / 1000) : 0;
    last = now;
    phase = (phase + dt) % CYCLE;
    t = tAtPhase(phase);
    render();
    frame = requestAnimationFrame(loop);
  };

  const wake = () => {
    if (frame || !canRun()) return;
    last = 0;
    frame = requestAnimationFrame(loop);
  };

  const setPlaying = (next: boolean) => {
    if (next === playing) return;
    playing = next;
    opts.onPlayingChange?.(next);
    if (next) {
      phase = phaseForT(t);
      wake();
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const setT = (next: number) => {
    setPlaying(false);
    t = clamp01(next);
    render();
  };

  // ---- input --------------------------------------------------------------

  // Grab the cloud and drag it along the time axis. A vertical (phone) axis
  // would fight page scrolling, so touch there is left to the slider.
  let dragging = false;
  const scrub = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    setT(tFromPoint(geo, e.clientX - rect.left, e.clientY - rect.top));
  };
  const onPointerDown = (e: PointerEvent) => {
    if (geo.vertical && e.pointerType === 'touch') return;
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
    scrub(e);
  };
  const onPointerMove = (e: PointerEvent) => {
    if (dragging) scrub(e);
  };
  const onPointerEnd = () => {
    dragging = false;
  };

  // ---- observers ----------------------------------------------------------

  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? true;
    wake();
  });
  const onVisibilityChange = () => {
    pageVisible = !document.hidden;
    wake();
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerEnd);
  canvas.addEventListener('pointercancel', onPointerEnd);
  document.addEventListener('visibilitychange', onVisibilityChange);
  resizeObserver.observe(canvas);
  intersectionObserver.observe(canvas);

  // Canvas text uses the web font; repaint the labels once it has loaded.
  void document.fonts?.ready.then(() => {
    if (!destroyed) paintLayer();
  });

  resize();
  if (opts.autoplay) setPlaying(true);
  else render();

  return {
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    setT,
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerEnd);
      canvas.removeEventListener('pointercancel', onPointerEnd);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(x) ? x : 0));
}
