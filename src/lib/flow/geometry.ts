// Layout of the figure in CSS pixels.
//
// The figure is a space-time view: p0 (noise) is drawn around point A, p1
// (data) around point B, and the cloud at time t is centred on lerp(A, B, t).
// Wide figures put A left of B; tall (phone) figures stack A above B. A strip
// along the bottom is left free for the time slider, which the page overlays
// so that, on wide figures, its ends sit under A and B.

import { NOISE_SIGMA } from './particles';

export type Geometry = {
  w: number;
  h: number;
  ax: number;
  ay: number;
  bx: number;
  by: number;
  /** Pixels per normalised unit. */
  s: number;
  vertical: boolean;
};

/** Spacing shared by the layout and the renderer, in CSS pixels. */
export const LAYOUT = {
  pad: 14,
  /** Two label lines above each distribution. */
  labelH: 34,
  /** The time-slider strip along the bottom edge. */
  axisH: 44,
} as const;

/** Half-extents in normalised units: 2σ of the prior, and the target picture. */
export const EXTENT = {
  p0Radius: NOISE_SIGMA * 2,
  p1HalfW: 0.95,
  p1HalfH: 0.82,
} as const;

/** Below this width-to-height ratio the figure stacks vertically. */
const VERTICAL_BELOW = 1.15;
/** Open road between the two shapes, in normalised units, so travel reads. */
const GAP_H = 1.5;
const GAP_V = 0.45;

export function measureGeometry(w: number, h: number): Geometry {
  const { pad, labelH, axisH } = LAYOUT;
  const { p0Radius, p1HalfW, p1HalfH } = EXTENT;
  const vertical = w < h * VERTICAL_BELOW;

  if (!vertical) {
    const availH = h - 2 * pad - labelH - axisH;
    const s = Math.max(1, Math.min(availH / (2 * p1HalfH), (w - 2 * pad) / (p0Radius + p1HalfW + GAP_H)));
    const cy = pad + labelH + availH / 2;
    return { w, h, vertical, s, ax: pad + p0Radius * s + 6, ay: cy, bx: w - pad - p1HalfW * s, by: cy };
  }

  const availW = w - 2 * pad;
  const availH = h - 2 * pad - 2 * labelH - axisH;
  const s = Math.max(1, Math.min(availW / (2 * p1HalfW), availH / (2 * p0Radius + 2 * p1HalfH + GAP_V)));
  const cx = w / 2;
  return {
    w,
    h,
    vertical,
    s,
    ax: cx,
    ay: pad + labelH + p0Radius * s,
    bx: cx,
    by: h - pad - axisH - p1HalfH * s,
  };
}

/** Maps a point to t by projecting it onto the A → B axis, clamped to [0, 1]. */
export function tFromPoint(g: Geometry, x: number, y: number): number {
  const dx = g.bx - g.ax;
  const dy = g.by - g.ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return 0;
  const t = ((x - g.ax) * dx + (y - g.ay) * dy) / len2;
  return Math.min(1, Math.max(0, t));
}

/**
 * Particle budget by figure area. The GPU renderer draws all samples in one
 * call, so it carries several times what the 2-D fallback can, which is what
 * keeps the picture sharp; both scale down on small plots.
 */
export function particleBudget(w: number, h: number, gpu = false): number {
  const area = w * h;
  if (gpu) {
    if (area < 120_000) return 30000;
    if (area < 220_000) return 45000;
    if (area < 450_000) return 70000;
    return 100000;
  }
  if (area < 120_000) return 6000;
  if (area < 220_000) return 9000;
  if (area < 450_000) return 12000;
  return 18000;
}
