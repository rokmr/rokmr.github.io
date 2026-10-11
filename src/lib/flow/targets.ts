// p1 — the target ("data") distributions the figure transports noise onto.
//
// Every sampler returns exactly `count` points in roughly [-1, 1]², each with
// a brightness in [0, 1]. `{ kind: 'image' }` stipples any transparent-
// background picture, so changing what the figure draws needs no code.

import { gauss } from './random';

export type TargetPoint = { x: number; y: number; b: number };

export type TargetSpec = { label: string } & (
  | { kind: 'twoMoons' }
  | { kind: 'eightGaussians' }
  | { kind: 'checkerboard' }
  | { kind: 'lorenz' }
  /** Transparent pixels are empty; darker pixels draw denser. */
  | { kind: 'image'; src: string }
);

/** What was actually sampled — differs from the spec when an image fails. */
export type Target = { points: TargetPoint[]; label: string };

const FALLBACK = { kind: 'twoMoons', label: 'two moons' } as const satisfies TargetSpec;

export async function sampleTarget(spec: TargetSpec, count: number): Promise<Target> {
  switch (spec.kind) {
    case 'twoMoons':
      return { points: twoMoons(count), label: spec.label };
    case 'eightGaussians':
      return { points: eightGaussians(count), label: spec.label };
    case 'checkerboard':
      return { points: checkerboard(count), label: spec.label };
    case 'lorenz':
      return { points: lorenz(count), label: spec.label };
    case 'image':
      try {
        const table = await loadStipple(spec.src);
        return { points: sampleStipple(table, count), label: spec.label };
      } catch (err) {
        // A missing or undecodable image must not leave the figure as bare noise.
        console.warn(`flow figure: could not load ${spec.src}; using ${FALLBACK.label}`, err);
        return { points: twoMoons(count), label: FALLBACK.label };
      }
  }
}

// ---------------------------------------------------------------------------
// Synthetic distributions — the standard 2-D toys from the flow literature.
// ---------------------------------------------------------------------------

const brightness = () => 0.55 + Math.random() * 0.4;

export function twoMoons(count: number): TargetPoint[] {
  const pts: TargetPoint[] = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI;
    // Outer moon spans x∈[-1,1], y∈[0,1]; inner spans x∈[0,2], y∈[-0.5,0.5].
    const outer = i % 2 === 0;
    const x = outer ? Math.cos(theta) : 1 - Math.cos(theta);
    const y = outer ? Math.sin(theta) : 0.5 - Math.sin(theta);
    // Centre the [-1,2]×[-0.5,1] box and scale both axes by its width.
    pts.push({
      x: ((x - 0.5) / 1.5) * 0.86 + gauss(0.045),
      y: -((y - 0.25) / 1.5) * 0.86 + gauss(0.045),
      b: brightness(),
    });
  }
  return pts;
}

export function eightGaussians(count: number): TargetPoint[] {
  const pts: TargetPoint[] = [];
  for (let i = 0; i < count; i++) {
    const a = ((i % 8) * Math.PI) / 4;
    pts.push({ x: Math.cos(a) * 0.72 + gauss(0.075), y: Math.sin(a) * 0.72 + gauss(0.075), b: brightness() });
  }
  return pts;
}

export function checkerboard(count: number): TargetPoint[] {
  const pts: TargetPoint[] = [];
  while (pts.length < count) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const gi = Math.floor(((x + 1) / 2) * 4);
    const gj = Math.floor(((y + 1) / 2) * 4);
    if ((gi + gj) % 2 === 0) pts.push({ x: x * 0.88, y: y * 0.88, b: brightness() });
  }
  return pts;
}

/** The Lorenz attractor projected onto x–z (the site's original hero). */
export function lorenz(count: number): TargetPoint[] {
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;
  const dt = 0.004;
  let x = 0.1;
  let y = 0;
  let z = 0;
  const step = () => {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
  };

  for (let i = 0; i < 2500; i++) step(); // settle onto the attractor
  const orbit: { x: number; y: number }[] = [];
  for (let i = 0; i < 30000; i++) {
    step();
    orbit.push({ x: x * 0.035, y: -(z - 25) * 0.035 });
  }

  // Stride over the orbit so any `count` covers the whole butterfly.
  return Array.from({ length: count }, (_, i) => {
    const p = orbit[Math.floor((i / count) * orbit.length)]!;
    return { x: p.x, y: p.y, b: 0.8 };
  });
}

// ---------------------------------------------------------------------------
// Image stippling
// ---------------------------------------------------------------------------

/** A sampling table over an image's pixels; built once per source. */
export type Stipple = {
  w: number;
  h: number;
  /** Cumulative pixel weights; the last entry is the total. */
  cdf: Float64Array;
  /** Per-pixel darkness in [0, 1], used for particle brightness. */
  dark: Float32Array;
};

/** Longest side the image is sampled at. Finer adds cost, not legibility. */
const STIPPLE_RES = 240;
/** Antialiased edge pixels below this alpha stay empty. */
const ALPHA_MIN = 0.5;
/** Normalised width of the stippled picture's longest side. */
const STIPPLE_SPAN = 1.9;

/**
 * Pixel weight for stippling. Alpha-gated, climbing with darkness cubed, so
 * linework (eyes, outlines, glasses) draws dense and flat fills stay sparse —
 * the picture stays recognisable at a few thousand points.
 */
export function stippleWeight(alpha: number, darkness: number): number {
  return alpha > ALPHA_MIN ? 0.04 + 3 * darkness ** 3 : 0;
}

/** Builds the table from RGBA pixels. Pure, so it is testable without a DOM. */
export function buildStipple(rgba: Uint8ClampedArray, w: number, h: number): Stipple {
  const cdf = new Float64Array(w * h);
  const dark = new Float32Array(w * h);
  let total = 0;
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    const d = 1 - (0.2126 * rgba[o]! + 0.7152 * rgba[o + 1]! + 0.0722 * rgba[o + 2]!) / 255;
    dark[i] = d;
    total += stippleWeight(rgba[o + 3]! / 255, d);
    cdf[i] = total;
  }
  if (total === 0) throw new Error('image has no opaque pixels');
  return { w, h, cdf, dark };
}

/** Draws `count` points by inverting the CDF, with sub-pixel jitter. */
export function sampleStipple({ w, h, cdf, dark }: Stipple, count: number): TargetPoint[] {
  const total = cdf[cdf.length - 1]!;
  const span = Math.max(w, h);
  const pts: TargetPoint[] = [];
  for (let n = 0; n < count; n++) {
    const r = Math.random() * total;
    let lo = 0;
    let hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid]! <= r) lo = mid + 1;
      else hi = mid;
    }
    const px = (lo % w) + Math.random();
    const py = Math.floor(lo / w) + Math.random();
    pts.push({
      x: ((px - w / 2) / span) * STIPPLE_SPAN,
      y: ((py - h / 2) / span) * STIPPLE_SPAN,
      b: 0.45 + 0.5 * dark[lo]!,
    });
  }
  return pts;
}

// Decoding and tabulating the image is the expensive part, and a resize that
// changes the particle budget only needs a new draw from the same table.
const stippleCache = new Map<string, Promise<Stipple>>();

function loadStipple(src: string): Promise<Stipple> {
  let pending = stippleCache.get(src);
  if (!pending) {
    pending = decodeStipple(src);
    // Do not cache a failure: a later mount should be able to retry.
    pending.catch(() => stippleCache.delete(src));
    stippleCache.set(src, pending);
  }
  return pending;
}

async function decodeStipple(src: string): Promise<Stipple> {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  await img.decode();

  const scale = STIPPLE_RES / Math.max(img.naturalWidth, img.naturalHeight);
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2d context unavailable');
  ctx.drawImage(img, 0, 0, w, h);
  return buildStipple(ctx.getImageData(0, 0, w, h).data, w, h);
}
