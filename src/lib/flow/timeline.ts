// Autoplay schedule for the figure, in seconds: sample forward from noise to
// data, hold on the data, rewind, hold on the noise, repeat.

export const FORWARD = 6;
const HOLD_DATA = 1.6;
const REWIND = 0.9;
const HOLD_NOISE = 0.5;
export const CYCLE = FORWARD + HOLD_DATA + REWIND + HOLD_NOISE;

/** Time t ∈ [0, 1] at a point `phase` seconds into the cycle. */
export function tAtPhase(phase: number): number {
  const p = ((phase % CYCLE) + CYCLE) % CYCLE;
  if (p < FORWARD) return p / FORWARD;
  if (p < FORWARD + HOLD_DATA) return 1;
  if (p < FORWARD + HOLD_DATA + REWIND) {
    const u = (p - FORWARD - HOLD_DATA) / REWIND;
    return 1 - u * u * (3 - 2 * u); // smoothstep, so the rewind reads as one motion
  }
  return 0;
}

/** Where to resume the cycle so playback continues from `t`; t = 1 restarts. */
export function phaseForT(t: number): number {
  return t >= 1 ? 0 : Math.max(0, t) * FORWARD;
}
