/**
 * Swaps hyphens inside compound words ("self-supervised", "knowledge-base")
 * for non-breaking hyphens (U+2011), so a line never breaks mid-word at the
 * hyphen. Ranges like "2023 - 2024" (spaced) are untouched.
 */
export function keepHyphens(text: string): string {
  return text.replace(/(\w)-(?=\w)/g, '$1‑');
}
