import { describe, expect, it } from 'vitest';
import { heroLinks, heroTarget } from './hero';
import { currentRole, experience, previousRole } from './experience';
import { firstPublication, latestPublication, paperName, publications, venueDetail } from './publications';

describe('hero + about data', () => {
  it('derives roles from the experience list', () => {
    expect(currentRole.current).toBe(true);
    expect(previousRole).toBeDefined();
    expect(previousRole).not.toBe(currentRole);
    expect(experience.indexOf(previousRole)).toBeGreaterThan(experience.indexOf(currentRole));
  });

  it('names papers by their title prefix', () => {
    expect(paperName(firstPublication)).toBe('TACLE');
    expect(paperName(latestPublication)).toBe('AttriStory');
    for (const pub of publications) expect(pub.venueShort.length).toBeLessThan(24);
  });

  it('does not repeat the short venue in its detail line', () => {
    expect(venueDetail(latestPublication)).toBe('Generative AI for Storytelling (AISTORY)');
    expect(venueDetail(firstPublication)).toBe('');
  });

  it('links the overview to external profiles', () => {
    for (const link of heroLinks) expect(link.href).toMatch(/^(https?:|mailto:)/);
  });

  it('points the figure at a shipped asset', () => {
    expect(heroTarget.kind).toBe('image');
    if (heroTarget.kind === 'image') expect(heroTarget.src).toMatch(/assets\/images\/gradi\.webp$/);
  });
});
