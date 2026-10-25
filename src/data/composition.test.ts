import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Home } from '../pages/Home';
import { sections } from './site';
import { featuredProjectIds, featuredProjects } from './projects';
import { experience } from './experience';

describe('portfolio composition', () => {
  it('renders chapters in registry order, with supporting sections nested', () => {
    expect(sections[0].id).toBe('research');
    const html = renderToStaticMarkup(createElement(Home, { buildYear: 2026 }));
    const order = Array.from(html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g), (match) => match[1]);
    expect(order).toEqual(['home', ...sections.map((section) => section.id)]);
    expect(html).toContain('id="skills"');
    expect(html).toContain('id="education"');
    expect(html.indexOf('id="skills"')).toBeGreaterThan(html.indexOf('id="experience"'));
    expect(html.indexOf('id="education"')).toBeGreaterThan(html.indexOf('id="about"'));
  });

  it('curates work with complete evidence and valid role references', () => {
    expect(new Set(featuredProjectIds).size).toBe(featuredProjects.length);
    const roles = new Set(experience.map((role) => role.id));
    for (const project of featuredProjects) {
      expect(project.problem?.trim()).toBeTruthy();
      expect(project.contribution?.trim()).toBeTruthy();
      expect(project.outcome?.trim()).toBeTruthy();
      if (project.roleId) expect(roles.has(project.roleId)).toBe(true);
    }
  });
});
