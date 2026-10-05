import { describe, expect, it } from 'vitest';
import { BRIGHTNESS, NOISE_SIGMA, STRIDE, X0, X1, Y0, Y1, arrowCount, createParticles, resampleNoise } from './particles';
import { twoMoons } from './targets';

describe('createParticles', () => {
  const targets = twoMoons(4000);
  const p = createParticles(targets);

  it('keeps one particle per target point', () => {
    expect(p.count).toBe(4000);
    expect(p.data.length).toBe(4000 * STRIDE);
  });

  it('sorts particles by brightness so the renderer can batch colours', () => {
    for (let i = 1; i < p.count; i++) {
      expect(p.data[i * STRIDE + BRIGHTNESS]!).toBeGreaterThanOrEqual(p.data[(i - 1) * STRIDE + BRIGHTNESS]!);
    }
  });

  it('draws noise with roughly the prior σ', () => {
    let sum = 0;
    for (let i = 0; i < p.count; i++) sum += p.data[i * STRIDE + X0]! ** 2;
    expect(Math.sqrt(sum / p.count)).toBeCloseTo(NOISE_SIGMA, 1);
  });

  it('puts velocity arrows on distinct samples that start within 2σ', () => {
    expect(new Set(p.arrows).size).toBe(p.arrows.length);
    expect(p.arrows.length).toBe(arrowCount(p.count));
    for (const i of p.arrows) {
      expect(i).toBeLessThan(p.count);
      const off = i * STRIDE;
      expect(Math.hypot(p.data[off + X0]!, p.data[off + Y0]!)).toBeLessThanOrEqual(NOISE_SIGMA * 2);
    }
  });

  it('spreads arrows through the cloud rather than clumping them', () => {
    expect(p.arrows[0]!).toBeLessThan(p.count * 0.05);
    expect(p.arrows[p.arrows.length - 1]!).toBeGreaterThan(p.count * 0.95);
  });

  it('scales the number of arrows with the cloud, within bounds', () => {
    expect(arrowCount(9000)).toBe(75);
    expect(arrowCount(18000)).toBe(110); // capped
    expect(arrowCount(1000)).toBe(50); // floored
    expect(arrowCount(5)).toBe(5); // never more than there are samples
  });
  it('replays with fresh noise onto the same data', () => {
    const again = resampleNoise(p);
    expect(again.count).toBe(p.count);
    let moved = 0;
    for (let i = 0; i < p.count; i++) {
      const off = i * STRIDE;
      expect(again.data[off + X1]).toBe(p.data[off + X1]);
      expect(again.data[off + Y1]).toBe(p.data[off + Y1]);
      expect(again.data[off + BRIGHTNESS]).toBe(p.data[off + BRIGHTNESS]);
      if (again.data[off + X0] !== p.data[off + X0]) moved++;
    }
    expect(moved).toBe(p.count);
    // The original is untouched, and arrows still start within 2σ.
    expect(again.data).not.toBe(p.data);
    for (const i of again.arrows) {
      const off = i * STRIDE;
      expect(Math.hypot(again.data[off + X0]!, again.data[off + Y0]!)).toBeLessThanOrEqual(NOISE_SIGMA * 2);
    }
  });
});
