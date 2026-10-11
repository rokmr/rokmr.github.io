import { describe, expect, it } from 'vitest';
import { hexToRgb } from './palette';

describe('hexToRgb', () => {
  it('converts 6-digit hex with or without #', () => {
    expect(hexToRgb('#4ade80')).toBe('74, 222, 128');
    expect(hexToRgb(' 4ADE80 ')).toBe('74, 222, 128');
  });

  it('returns null for anything else', () => {
    expect(hexToRgb('')).toBeNull();
    expect(hexToRgb('#fff')).toBeNull();
    expect(hexToRgb('rgb(1,2,3)')).toBeNull();
  });
});
