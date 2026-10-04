// Canvas drawing for the figure, split in two layers:
//
//   drawStatic  everything that does not move with t — both distributions as
//               faint ghosts, the prior's σ contours, the full straight rays
//               and the labels. Drawn once per resize.
//   drawFrame   blits that layer, then the live cloud x_t and the travelled
//               part of each ray. Drawn every animation frame.
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

function label(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  word: string,
  notation: string,
  palette: Palette,
): void {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `500 12px ${MONO}`;
  ctx.fillStyle = palette.ink;
  ctx.fillText(word, x, y - 15);
  ctx.font = `400 11px ${MONO}`;
  ctx.fillStyle = palette.muted;
  ctx.fillText(notation, x, y);
}

export function drawStatic(
  ctx: CanvasRenderingContext2D,
  g: Geometry,
  particles: Particles | null,
  palette: Palette,
  targetLabel: string,
): void {
  const { w, h, ax, ay, bx, by, s, vertical } = g;
  const { pad, labelH } = LAYOUT;
  const { p0Radius, p1HalfH } = EXTENT;

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

  if (particles) {
    const { data, count, trails } = particles;

    // Ghosts of both endpoint distributions; p1 denser so the picture reads.
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < count; i += 3) {
      const off = i * STRIDE;
      ctx.fillRect(ax + data[off + X0]! * s - 0.5, ay + data[off + Y0]! * s - 0.5, 1, 1);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.17)';
    for (let i = 1; i < count; i += 2) {
      const off = i * STRIDE;
      ctx.fillRect(bx + data[off + X1]! * s - 0.5, by + data[off + Y1]! * s - 0.5, 1, 1);
    }

    // Full rays x0 → x1: the straight paths the model is trained to follow.
    const rays = new Path2D();
    for (const i of trails) {
      const off = i * STRIDE;
      rays.moveTo(ax + data[off + X0]! * s, ay + data[off + Y0]! * s);
      rays.lineTo(bx + data[off + X1]! * s, by + data[off + Y1]! * s);
    }
    ctx.save();
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = `rgba(${palette.accent},0.3)`;
    ctx.lineWidth = 0.8;
    ctx.stroke(rays);
    ctx.restore();
  }

  // Labels: a plain word for everyone, notation for people who know it.
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

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  g: Geometry,
  layer: CanvasImageSource,
  particles: Particles | null,
  t: number,
  palette: Palette,
): void {
  const { w, h, ax, ay, bx, by, s } = g;
  const accent = palette.accent;
  const cx = ax + (bx - ax) * t;
  const cy = ay + (by - ay) * t;

  ctx.drawImage(layer, 0, 0, w, h);

  if (!particles) return;
  const { data, count, trails } = particles;
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

  // Travelled part of each ray, with an arrowhead pointing along x1 − x0.
  const paths = new Path2D();
  const heads = new Path2D();
  const hl = 7;
  for (const i of trails) {
    const off = i * STRIDE;
    const x0 = ax + data[off + X0]! * s;
    const y0 = ay + data[off + Y0]! * s;
    const x1 = bx + data[off + X1]! * s;
    const y1 = by + data[off + Y1]! * s;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    paths.moveTo(x0, y0);
    paths.lineTo(x, y);
    const len = Math.hypot(x1 - x0, y1 - y0) || 1;
    const nx = (x1 - x0) / len;
    const ny = (y1 - y0) / len;
    heads.moveTo(x + nx * 2, y + ny * 2);
    heads.lineTo(x - nx * hl - ny * hl * 0.5, y - ny * hl + nx * hl * 0.5);
    heads.lineTo(x - nx * hl + ny * hl * 0.5, y - ny * hl - nx * hl * 0.5);
    heads.closePath();
  }
  // Rays and arrowheads give way to the picture once it has arrived.
  const arrive = Math.min(1, Math.max(0, (t - 0.85) / 0.15));
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = `rgba(${accent},${0.75 - arrive * 0.5})`;
  ctx.stroke(paths);
  ctx.fillStyle = `rgba(${accent},${1 - arrive * 0.7})`;
  ctx.fill(heads);
}
