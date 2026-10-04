/** Colours the renderer needs, read from design tokens. `accent` is "r, g, b". */
export type Palette = { bg: string; accent: string; ink: string; muted: string };

const DEFAULTS: Palette = { bg: '#0d0d0d', accent: '74, 222, 128', ink: '#e8e8e8', muted: '#888888' };

/** "#4ade80" → "74, 222, 128", for composing rgba() with a varying alpha. */
export function hexToRgb(hex: string): string | null {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  return m ? `${parseInt(m[1]!, 16)}, ${parseInt(m[2]!, 16)}, ${parseInt(m[3]!, 16)}` : null;
}

/** Reads the palette from the CSS custom properties in scope at `el`. */
export function readPalette(el: Element): Palette {
  const css = getComputedStyle(el);
  const token = (name: string) => css.getPropertyValue(name).trim();
  return {
    bg: token('--surface-inset') || DEFAULTS.bg,
    accent: hexToRgb(token('--ink-accent')) ?? DEFAULTS.accent,
    ink: token('--ink') || DEFAULTS.ink,
    muted: token('--ink-muted') || DEFAULTS.muted,
  };
}
