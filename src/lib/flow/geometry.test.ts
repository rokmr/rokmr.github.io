import { describe, expect, it } from 'vitest';
import { EXTENT, LAYOUT, measureGeometry, particleBudget, tFromPoint } from './geometry';

// Real plot sizes: desktop 3:1, tablet 16:9, phones 2:3.
const sizes: [number, number][] = [
  [1208, 403],
  [1000, 333],
  [720, 405],
  [560, 315],
  [358, 537],
  [328, 492],
];

describe('measureGeometry', () => {
  it('lays wide plots out side by side and tall ones stacked', () => {
    expect(measureGeometry(1208, 403).vertical).toBe(false);
    expect(measureGeometry(720, 405).vertical).toBe(false);
    expect(measureGeometry(358, 537).vertical).toBe(true);
  });

  it.each(sizes)('keeps both distributions inside a %ix%i plot', (w, h) => {
    const g = measureGeometry(w, h);
    const { p0Radius, p1HalfW, p1HalfH } = EXTENT;
    // p0 (2σ disc) around A
    expect(g.ax - p0Radius * g.s).toBeGreaterThanOrEqual(0);
    expect(g.ay - p0Radius * g.s).toBeGreaterThanOrEqual(0);
    // p1 (picture box) around B
    expect(g.bx + p1HalfW * g.s).toBeLessThanOrEqual(w + 0.5);
    expect(g.by + p1HalfH * g.s).toBeLessThanOrEqual(h + 0.5);
    // ...and clear of the slider strip along the bottom.
    expect(g.by + p1HalfH * g.s).toBeLessThanOrEqual(h - LAYOUT.axisH);
  });

  it.each(sizes)('leaves open road between noise and data in a %ix%i plot', (w, h) => {
    const g = measureGeometry(w, h);
    const { p0Radius, p1HalfW, p1HalfH } = EXTENT;
    const gap = g.vertical
      ? g.by - p1HalfH * g.s - (g.ay + p0Radius * g.s)
      : g.bx - p1HalfW * g.s - (g.ax + p0Radius * g.s);
    expect(gap).toBeGreaterThan(0);
  });

  it('degrades without NaN for an unmeasured canvas', () => {
    const g = measureGeometry(1, 1);
    for (const v of Object.values(g)) if (typeof v === 'number') expect(Number.isFinite(v)).toBe(true);
  });
});

describe('tFromPoint', () => {
  const g = measureGeometry(1208, 403);

  it('maps A to 0, B to 1 and the midpoint to 0.5', () => {
    expect(tFromPoint(g, g.ax, g.ay)).toBe(0);
    expect(tFromPoint(g, g.bx, g.by)).toBe(1);
    expect(tFromPoint(g, (g.ax + g.bx) / 2, g.ay + 50)).toBeCloseTo(0.5);
  });

  it('clamps points beyond either end', () => {
    expect(tFromPoint(g, -500, g.ay)).toBe(0);
    expect(tFromPoint(g, 5000, g.ay)).toBe(1);
  });

  it('returns 0 rather than NaN when A and B coincide', () => {
    expect(tFromPoint({ ...g, bx: g.ax, by: g.ay }, 10, 10)).toBe(0);
  });
});

describe('particleBudget', () => {
  it('never decreases as the plot grows', () => {
    let prev = 0;
    for (let side = 100; side <= 1400; side += 50) {
      const n = particleBudget(side, side / 2);
      expect(n).toBeGreaterThanOrEqual(prev);
      prev = n;
    }
  });
});
