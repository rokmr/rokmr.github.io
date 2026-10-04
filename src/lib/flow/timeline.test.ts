import { describe, expect, it } from 'vitest';
import { CYCLE, FORWARD, phaseForT, tAtPhase } from './timeline';

describe('tAtPhase', () => {
  it('starts at noise and reaches data at the end of the forward pass', () => {
    expect(tAtPhase(0)).toBe(0);
    expect(tAtPhase(FORWARD / 2)).toBeCloseTo(0.5);
    expect(tAtPhase(FORWARD)).toBe(1);
  });

  it('stays within [0, 1] and is continuous across a full cycle', () => {
    let prev = tAtPhase(0);
    for (let p = 0; p <= CYCLE * 2; p += 0.01) {
      const t = tAtPhase(p);
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeLessThanOrEqual(1);
      // At 100 Hz sampling no step should jump more than the rewind's peak slope allows.
      expect(Math.abs(t - prev)).toBeLessThan(0.02);
      prev = t;
    }
  });

  it('wraps phases outside one cycle, including negative ones', () => {
    expect(tAtPhase(CYCLE + 1)).toBeCloseTo(tAtPhase(1));
    expect(tAtPhase(-CYCLE + 1)).toBeCloseTo(tAtPhase(1));
  });
});

describe('phaseForT', () => {
  it('resumes playback from the time shown', () => {
    for (const t of [0, 0.25, 0.5, 0.99]) expect(tAtPhase(phaseForT(t))).toBeCloseTo(t);
  });

  it('restarts from noise when the data is already showing', () => {
    expect(phaseForT(1)).toBe(0);
  });
});
