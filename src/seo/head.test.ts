import { describe, expect, it } from 'vitest';
import { renderHead } from './head';
import { homeStructuredData } from './structuredData';

describe('public profile metadata', () => {
  it('identifies the actual employer without advertising a nonexistent search action', () => {
    const profile = homeStructuredData.find(entry => entry['@type'] === 'ProfilePage');
    const website = homeStructuredData.find(entry => entry['@type'] === 'WebSite');
    expect(profile).toHaveProperty('mainEntity.worksFor.url', 'https://www.armada.ai/');
    expect(website).not.toHaveProperty('potentialAction');
    expect(JSON.stringify(profile)).not.toContain('Reinforcement Learning');
  });
  it('keeps the known publication year without inventing an exact date', () => {
    const head = renderHead('/tacle/');
    expect(head).not.toContain('2025-01-01');
    expect(head).toContain('https://rohit.vision/tacle/');
  });
});
