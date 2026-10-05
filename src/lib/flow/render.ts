// Canvas drawing for the figure, split in two layers:
//
//   drawStatic  everything that does not move with t: the background and the
//               prior's σ contours, which mark where the samples start. Drawn
//               once per resize. Every dot on the canvas is a live sample —
//               there are deliberately no faint copies of the start or end
//               distributions, which read as samples left behind.
//   drawFrame   blits that layer, then the live samples x_t with a velocity
//               arrow on a spread of them, then the labels on top so passing
//               samples never cover them. Drawn every animation frame.
//
// The time axis is not drawn here: the page lays its slider over the strip
// the geometry reserves along the bottom.
//
// Both expect a context whose transform maps CSS pixels to device pixels.

import { EXTENT, LAYOUT, type Geometry } from './geometry';
import type { Palette } from './palette';
import { BRIGHTNESS, NOISE_SIGMA, STRIDE, X0, X1, Y0, Y1, type Particles } from './particles';

const MONO = '"JetBrains Mono", ui-monospace, monospace';
/** Grey levels the live cloud is quantised to; one fillStyle change per level. */
const NBUCKETS = 32;
/** Velocity arrow geometry, in CSS pixels. */
const ARROW_TAIL = 5;
const ARROW_AHEAD = 9;
const ARROW_HEAD = 5;

/** Two centred label lines on a dark backing, so samples passing under stay out of the way. */
function label(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  word: string,
  notation: string,
  palette: Palette,
): void {
  ctx.font = `500 12px ${MONO}`;
  const wordW = ctx.measureText(word).width;
  ctx.font = `400 11px ${MONO}`;
  const notationW = ctx.measureText(notation).width;
  const boxW = Math.max(wordW, notationW) + 12;
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(x - boxW / 2, y - 29, boxW, 34);
  ctx.globalAlpha = 1;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `500 12px ${MONO}`;
  ctx.fillStyle = palette.ink;
  ctx.fillText(word, x, y - 15);
  ctx.font = `400 11px ${MONO}`;
  ctx.fillStyle = palette.muted;
  ctx.fillText(notation, x, y);
}

/** Labels: a plain word for everyone, notation for people who know it. */
function drawLabels(ctx: CanvasRenderingContext2D, g: Geometry, palette: Palette, targetLabel: string): void {
  const { ax, ay, bx, by, s, vertical } = g;
  const { pad, labelH } = LAYOUT;
  const { p0Radius, p1HalfH } = EXTENT;
  // Each sits just over its own shape rather than pinned to the top edge.
  const minY = pad + labelH - 6;
  if (!vertical) {
    label(ctx, ax, Math.max(minY, ay - p0Radius * s - 6), 'noise', 'x₀ ~ N(0, I)', palette);
    label(ctx, bx, Math.max(minY, ay - p1HalfH * s - 4), `data · ${targetLabel}`, 'x₁ ~ p_data', palette);
  } else {
    label(ctx, ax, ay - p0Radius * s - 8, 'noise', 'x₀ ~ N(0, I)', palette);
    label(ctx, bx, by - p1HalfH * s - 4, `data · ${targetLabel}`, 'x₁ ~ p_data', palette);
  }
}

export function drawStatic(ctx: CanvasRenderingContext2D, g: Geometry, palette: Palette): void {
  const { w, h, ax, ay, s } = g;
  const { p0Radius } = EXTENT;

  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);

  // The prior's 1σ and 2σ contours.
  ctx.save();
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.arc(ax, ay, NOISE_SIGMA * s, 0, Math.PI * 2);
  ctx.moveTo(ax + p0Radius * s, ay);
  ctx.arc(ax, ay, p0Radius * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMoving(
  ctx: CanvasRenderingContext2D,
  g: Geometry,
  particles: Particles,
  t: number,
  palette: Palette,
): void {
  const { ax, ay, bx, by, s } = g;
  const accent = palette.accent;
  const cx = ax + (bx - ax) * t;
  const cy = ay + (by - ay) * t;

  const { data, count, arrows } = particles;
  const u = 1 - t;

  // The live cloud: x_t = (1 − t)·x0 + t·x1, centred on lerp(A, B, t).
  // fillRect is 10-20x faster than arc() at sub-pixel sizes.
  const alpha = (0.5 + t * 0.35).toFixed(2);
  const colours = new Array<string>(NBUCKETS);
  for (let bi = 0; bi < NBUCKETS; bi++) {
    const grey = ((bi / (NBUCKETS - 1)) * 255) | 0;
    colours[bi] = `rgba(${grey},${grey},${grey},${alpha})`;
  }
  let prev = -1;
  for (let i = 0; i < count; i++) {
    const off = i * STRIDE;
    const x = cx + (u * data[off + X0]! + t * data[off + X1]!) * s;
    const y = cy + (u * data[off + Y0]! + t * data[off + Y1]!) * s;
    const b = u * 0.6 + t * data[off + BRIGHTNESS]!;
    const bi = Math.min(NBUCKETS - 1, Math.max(0, (b * NBUCKETS) | 0));
    if (bi !== prev) {
      ctx.fillStyle = colours[bi]!;
      prev = bi;
    }
    ctx.fillRect(x - 0.55, y - 0.55, 1.1, 1.1);
  }

  // Velocity arrows on a spread of samples. Each points along the sample's
  // motion as drawn — its own x1 − x0 plus the A → B drift that stands in
  // for time — so the arrows show exactly where the dots are heading. They
  // fade out as the samples arrive.
  const arrive = Math.min(1, Math.max(0, (t - 0.82) / 0.18));
  const arrowAlpha = 0.9 * (1 - arrive * arrive * (3 - 2 * arrive));
  if (arrowAlpha < 0.01) return;

  const driftX = bx - ax;
  const driftY = by - ay;
  const shafts = new Path2D();
  const heads = new Path2D();
  for (const i of arrows) {
    const off = i * STRIDE;
    const x = cx + (u * data[off + X0]! + t * data[off + X1]!) * s;
    const y = cy + (u * data[off + Y0]! + t * data[off + Y1]!) * s;
    const vx = driftX + (data[off + X1]! - data[off + X0]!) * s;
    const vy = driftY + (data[off + Y1]! - data[off + Y0]!) * s;
    const len = Math.hypot(vx, vy) || 1;
    const nx = vx / len;
    const ny = vy / len;
    // The arrow sits on the sample: a short tail behind it, the tip ahead.
    const tipX = x + nx * ARROW_AHEAD;
    const tipY = y + ny * ARROW_AHEAD;
    shafts.moveTo(x - nx * ARROW_TAIL, y - ny * ARROW_TAIL);
    shafts.lineTo(tipX, tipY);
    heads.moveTo(tipX + nx * 1.5, tipY + ny * 1.5);
    heads.lineTo(tipX - nx * ARROW_HEAD - ny * ARROW_HEAD * 0.5, tipY - ny * ARROW_HEAD + nx * ARROW_HEAD * 0.5);
    heads.lineTo(tipX - nx * ARROW_HEAD + ny * ARROW_HEAD * 0.5, tipY - ny * ARROW_HEAD - nx * ARROW_HEAD * 0.5);
    heads.closePath();
  }
  ctx.lineWidth = 1.1;
  ctx.strokeStyle = `rgba(${accent},${arrowAlpha * 0.85})`;
  ctx.stroke(shafts);
  ctx.fillStyle = `rgba(${accent},${arrowAlpha})`;
  ctx.fill(heads);
}

/**
 * One animation frame: the static layer, the moving samples at `opacity`
 * (the loop fades them out and fresh noise in), then the labels on top.
 */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  g: Geometry,
  layer: CanvasImageSource,
  particles: Particles | null,
  t: number,
  opacity: number,
  palette: Palette,
  targetLabel: string,
): void {
  ctx.drawImage(layer, 0, 0, g.w, g.h);
  if (particles && opacity > 0) {
    ctx.globalAlpha = opacity;
    drawMoving(ctx, g, particles, t, palette);
    ctx.globalAlpha = 1;
  }
  drawLabels(ctx, g, palette, targetLabel);
}
