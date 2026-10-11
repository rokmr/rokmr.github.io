import { describe, expect, it } from 'vitest';
import { keepHyphens } from './text';

describe('keepHyphens', () => {
  it('joins compound words with a non-breaking hyphen', () => {
    expect(keepHyphens('self-supervised knowledge-base')).toBe('self‑supervised knowledge‑base');
  });
  it('leaves spaced ranges and dashes alone', () => {
    expect(keepHyphens('2023 - 2024 — done')).toBe('2023 - 2024 — done');
  });
});
