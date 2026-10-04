import { describe, expect, it } from 'vitest';
import { BRIGHTNESS, NOISE_SIGMA, STRIDE, X0, Y0, createParticles } from './particles';
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

  it('highlights distinct rays that start inside the prior', () => {
    expect(new Set(p.trails).size).toBe(p.trails.length);
    for (const i of p.trails) {
      expect(i).toBeLessThan(p.count);
      const off = i * STRIDE;
      expect(Math.hypot(p.data[off + X0]!, p.data[off + Y0]!)).toBeLessThanOrEqual(NOISE_SIGMA * 1.8);
    }
  });

  it('copes with fewer points than rays', () => {
    const small = createParticles(twoMoons(5));
    expect(small.trails.length).toBe(5);
  });
});
