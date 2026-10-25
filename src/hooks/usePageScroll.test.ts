import { describe, expect, it } from 'vitest';
import { activeSectionAt } from './usePageScroll';

describe('active section', () => {
  it('keeps the introduction clear and follows document order', () => {
    expect(activeSectionAt([{id:'research',top:400}],0,800,3000)).toBeNull();
    expect(activeSectionAt([{id:'research',top:-200},{id:'projects',top:120}],600,800,3000)).toBe('projects');
  });
  it('selects a short contact section at page end and recalculates after expansion', () => {
    const tops = [{id:'about' as const,top:-100},{id:'contact' as const,top:500}];
    expect(activeSectionAt(tops,2000,800,2800)).toBe('contact');
    expect(activeSectionAt(tops,2000,800,3500)).toBe('about');
  });
});
