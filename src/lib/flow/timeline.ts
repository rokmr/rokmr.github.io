// Playback schedule for the figure, in seconds. One cycle generates one
// sample of the picture:
//
//   fade in   fresh noise appears                 t = 0, opacity 0 → 1
//   lead      a beat so the arrows register       t = 0
//   forward   samples travel noise → data         t 0 → 1
//   hold      rest on the finished picture        t = 1
//   fade out  the picture fades away              t = 1, opacity 1 → 0
//
// then the controller draws new noise and the cycle repeats. Time never runs
// backwards: going from data to noise is the noising (forward) process of
// diffusion, not sampling, so the loop restarts by fading rather than
// rewinding.

const FADE_IN = 0.4;
export const LEAD = 0.8;
export const FORWARD = 6;
const HOLD = 2.5;
const FADE_OUT = 0.6;

const FORWARD_START = FADE_IN + LEAD;
const HOLD_START = FORWARD_START + FORWARD;
const FADE_OUT_START = HOLD_START + HOLD;
export const CYCLE = FADE_OUT_START + FADE_OUT;

/** What to draw at `phase` seconds into a cycle. */
export type Frame = { t: number; opacity: number };

export function frameAt(phase: number): Frame {
  const p = Math.min(CYCLE, Math.max(0, phase));
  if (p < FADE_IN) return { t: 0, opacity: smooth(p / FADE_IN) };
  if (p < FORWARD_START) return { t: 0, opacity: 1 };
  if (p < HOLD_START) return { t: (p - FORWARD_START) / FORWARD, opacity: 1 };
  if (p < FADE_OUT_START) return { t: 1, opacity: 1 };
  return { t: 1, opacity: 1 - smooth((p - FADE_OUT_START) / FADE_OUT) };
}

/**
 * Where to resume so playback carries on forward from `t`: from t = 0 it
 * starts with the lead beat, mid-way it continues the pass, and from t = 1 it
 * rests on the picture before the next cycle.
 */
export function phaseForT(t: number): number {
  if (t <= 0) return FADE_IN;
  if (t >= 1) return HOLD_START;
  return FORWARD_START + t * FORWARD;
}

function smooth(u: number): number {
  return u * u * (3 - 2 * u);
}
