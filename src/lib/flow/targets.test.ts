import { describe, expect, it } from 'vitest';
import {
  buildStipple,
  checkerboard,
  eightGaussians,
  lorenz,
  sampleStipple,
  sampleTarget,
  stippleWeight,
  twoMoons,
} from './targets';

describe('synthetic targets', () => {
  it.each([
    ['twoMoons', twoMoons],
    ['eightGaussians', eightGaussians],
    ['checkerboard', checkerboard],
    ['lorenz', lorenz],
  ] as const)('%s returns exactly the requested count, inside the figure', (_, sample) => {
    const pts = sample(2500);
    expect(pts).toHaveLength(2500);
    for (const p of pts) {
      expect(Math.abs(p.x)).toBeLessThan(1.3);
      expect(Math.abs(p.y)).toBeLessThan(1.3);
      expect(p.b).toBeGreaterThanOrEqual(0);
      expect(p.b).toBeLessThanOrEqual(1);
    }
  });

  it('labels the result with the spec label', async () => {
    const result = await sampleTarget({ kind: 'twoMoons', label: 'moons' }, 10);
    expect(result.label).toBe('moons');
    expect(result.points).toHaveLength(10);
  });
});

describe('image stippling', () => {
  // 4x2 image: left half transparent, right half opaque (one black, one white per row).
  const w = 4;
  const h = 2;
  const rgba = new Uint8ClampedArray(w * h * 4);
  const set = (x: number, y: number, v: number, a: number) => rgba.set([v, v, v, a], (y * w + x) * 4);
  for (let y = 0; y < h; y++) {
    set(0, y, 0, 0);
    set(1, y, 0, 0);
    set(2, y, 0, 255);
    set(3, y, 255, 255);
  }

  it('weights dark linework above flat fills and ignores transparency', () => {
    expect(stippleWeight(1, 1)).toBeGreaterThan(stippleWeight(1, 0));
    expect(stippleWeight(0.2, 1)).toBe(0);
  });

  it('never places a point on a transparent pixel', () => {
    const table = buildStipple(rgba, w, h);
    const pts = sampleStipple(table, 2000);
    expect(pts).toHaveLength(2000);
    // Columns 0-1 map to x < 0 after centring; they are transparent.
    for (const p of pts) expect(p.x).toBeGreaterThanOrEqual(0);
  });

  it('puts most points on the dark pixels', () => {
    const pts = sampleStipple(buildStipple(rgba, w, h), 4000);
    const onDark = pts.filter((p) => p.x < 0.475).length; // column 2 spans x ∈ [0, 0.475)
    expect(onDark / pts.length).toBeGreaterThan(0.9);
  });

  it('rejects an image with nothing opaque', () => {
    expect(() => buildStipple(new Uint8ClampedArray(16), 2, 2)).toThrow();
  });
});
