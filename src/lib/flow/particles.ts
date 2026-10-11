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

/** About one sample in this many carries a velocity arrow, within bounds. */
const ARROW_EVERY = 120;
const ARROWS_MIN = 50;
const ARROWS_MAX = 110;
/** Only samples that start within 2σ carry arrows; outliers land on labels. */
const ARROW_START_LIMIT = NOISE_SIGMA * 2;

export type Particles = {
  /** Flat [x0, y0, x1, y1, b] per particle, sorted by b — cache-friendly, no GC churn. */
  readonly data: Float32Array;
  readonly count: number;
  /** Distinct particles that carry a velocity arrow while they travel. */
  readonly arrows: Uint32Array;
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

  return { data, count, arrows: pickArrows(data, count) };
}

/**
 * The same data with a fresh noise draw — what "generate again" means. Each
 * sample keeps its target x1 (so the brightness sort still holds) and gets a
 * new x0; arrows are re-picked because they depend on where samples start.
 */
export function resampleNoise(particles: Particles): Particles {
  const data = particles.data.slice();
  for (let i = 0; i < particles.count; i++) {
    const off = i * STRIDE;
    data[off + X0] = gauss(NOISE_SIGMA);
    data[off + Y0] = gauss(NOISE_SIGMA);
  }
  return { data, count: particles.count, arrows: pickArrows(data, particles.count) };
}

/** How many samples carry a velocity arrow for a cloud of `count`. */
export function arrowCount(count: number): number {
  return Math.min(count, Math.max(ARROWS_MIN, Math.min(ARROWS_MAX, Math.round(count / ARROW_EVERY))));
}

/**
 * Evenly spaced through the samples that start within 2σ. Particles are
 * sorted by brightness, which is uncorrelated with position, so this spreads
 * the arrows across the cloud without clumping.
 */
function pickArrows(data: Float32Array, count: number): Uint32Array {
  const inside: number[] = [];
  for (let i = 0; i < count; i++) {
    const off = i * STRIDE;
    if (Math.hypot(data[off + X0]!, data[off + Y0]!) <= ARROW_START_LIMIT) inside.push(i);
  }
  const n = Math.min(arrowCount(count), inside.length);
  const arrows = new Uint32Array(n);
  for (let k = 0; k < n; k++) arrows[k] = inside[Math.floor(((k + 0.5) / n) * inside.length)]!;
  return arrows;
}
