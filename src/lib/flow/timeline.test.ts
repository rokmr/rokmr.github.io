import { describe, expect, it } from 'vitest';
import { CYCLE, FORWARD, LEAD, frameAt, phaseForT } from './timeline';

describe('frameAt', () => {
  it('fades fresh noise in, then holds on it before moving', () => {
    expect(frameAt(0)).toEqual({ t: 0, opacity: 0 });
    const lead = frameAt(0.4 + LEAD / 2);
    expect(lead.t).toBe(0);
    expect(lead.opacity).toBe(1);
  });

  it('travels from noise to data, then rests on the picture', () => {
    expect(frameAt(0.4 + LEAD + FORWARD / 2).t).toBeCloseTo(0.5);
    expect(frameAt(0.4 + LEAD + FORWARD + 1)).toEqual({ t: 1, opacity: 1 });
  });

  it('ends the cycle by fading the picture out, not by rewinding it', () => {
    expect(frameAt(CYCLE)).toEqual({ t: 1, opacity: 0 });
    expect(frameAt(CYCLE - 0.3).t).toBe(1);
  });

  it('never runs time backwards within a cycle', () => {
    let prev = frameAt(0).t;
    for (let p = 0; p <= CYCLE; p += 0.01) {
      const { t } = frameAt(p);
      expect(t).toBeGreaterThanOrEqual(prev);
      prev = t;
    }
  });

  it('is invisible at the wrap, so swapping in new noise cannot be seen', () => {
    expect(frameAt(CYCLE).opacity).toBe(0);
    expect(frameAt(0).opacity).toBe(0);
  });
});

describe('phaseForT', () => {
  it('resumes forward from the time shown', () => {
    for (const t of [0, 0.25, 0.5, 0.99, 1]) expect(frameAt(phaseForT(t)).t).toBeCloseTo(t);
  });

  it('resumes fully visible, never mid-fade', () => {
    for (const t of [0, 0.5, 1]) expect(frameAt(phaseForT(t)).opacity).toBe(1);
  });
});
