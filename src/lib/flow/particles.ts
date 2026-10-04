// Particle storage for the figure.
//
// Each particle pairs a noise sample x0 ~ N(0, σ²I) with a data sample x1.
// Flow matching with the linear (rectified / OT) path puts it at
//   x_t = (1 − t)·x0 + t·x1,   with target velocity  dx/dt = x1 − x0,
// so every sample travels a straight line.

import { gauss } from './random';
import type { TargetPoint } from './targets';

/** σ of the prior. Small enough that the 2σ disc and the target fit side by side. */
export const NOISE_SIGMA = 0.35;

/** Floats per particle and their offsets in `Particles.data`. */
export const STRIDE = 5;
export const X0 = 0;
export const Y0 = 1;
export const X1 = 2;
export const Y1 = 3;
export const BRIGHTNESS = 4;

const TRAIL_COUNT = 14;

export type Particles = {
  /** Flat [x0, y0, x1, y1, b] per particle, sorted by b — cache-friendly, no GC churn. */
  readonly data: Float32Array;
  readonly count: number;
  /** Distinct particles whose full x0 → x1 ray is drawn. */
  readonly trails: Uint32Array;
};

export function createParticles(targets: readonly TargetPoint[]): Particles {
  const count = targets.length;
  const raw = new Float32Array(count * STRIDE);

  for (let i = 0; i < count; i++) {
    const tp = targets[i]!;
    const off = i * STRIDE;
    raw[off + X0] = gauss(NOISE_SIGMA);
    raw[off + Y0] = gauss(NOISE_SIGMA);
    raw[off + X1] = tp.x;
    raw[off + Y1] = tp.y;
    raw[off + BRIGHTNESS] = tp.b;
  }

  // Sort by brightness so adjacent particles share a colour bucket; the
  // renderer then changes fillStyle ~32 times per frame instead of thousands.
  const order = new Uint32Array(count);
  for (let i = 0; i < count; i++) order[i] = i;
  order.sort((a, b) => raw[a * STRIDE + BRIGHTNESS]! - raw[b * STRIDE + BRIGHTNESS]!);

  const data = new Float32Array(count * STRIDE);
  for (let i = 0; i < count; i++) {
    const src = order[i]! * STRIDE;
    data.set(raw.subarray(src, src + STRIDE), i * STRIDE);
  }

  return { data, count, trails: pickTrails(data, count) };
}

/**
 * Spreads the highlighted rays evenly through the array. Brightness order is
 * uncorrelated with position, so this spreads them across both distributions.
 * Noise samples beyond ~2σ are skipped: their rays would start off the figure.
 */
function pickTrails(data: Float32Array, count: number): Uint32Array {
  const n = Math.min(TRAIL_COUNT, count);
  const trails = new Uint32Array(n);
  const used = new Set<number>();
  const limit = NOISE_SIGMA * 1.8;

  for (let k = 0; k < n; k++) {
    let j = Math.floor(((k + 0.5) / n) * count);
    for (let tries = 0; tries < count; tries++, j = (j + 1) % count) {
      const off = j * STRIDE;
      if (!used.has(j) && Math.hypot(data[off + X0]!, data[off + Y0]!) <= limit) break;
    }
    used.add(j);
    trails[k] = j;
  }
  return trails;
}
