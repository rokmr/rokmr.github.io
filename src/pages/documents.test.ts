import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { App, routes, toRoute } from '../App';
import { renderHead } from '../seo/head';
import { caseStudies } from '../data/caseStudies';

describe('public document routes', () => {
  it('resolves and prerenders every selected case study with its own canonical', () => {
    for (const study of caseStudies) {
      const route = `/work/${study.id}/` as const;
      expect(routes).toContain(route);
      expect(toRoute(route+'index.html')).toBe(route);
      const html = renderToStaticMarkup(createElement(App, {route,buildYear:2026}));
      expect(html).toContain(study.title.replace(/&/g,'&amp;'));
      expect(html).toContain('All work');
      expect(renderHead(route)).toContain(`rel="canonical" href="https://rohit.vision${route}"`);
    }
  });
  it('provides an actual printable résumé without private-source import', () => {
    expect(toRoute('/resume')).toBe('/resume/');
    const html = renderToStaticMarkup(createElement(App, {route:'/resume/',buildYear:2026}));
    expect(html).toContain('>Print</button>');
    expect(html).toContain('/assets/Rohit-Kumar-Resume.pdf');
    expect(html).toContain('Armada AI');
    expect(html).toContain('Equal contribution');
    expect(html).not.toContain('vllm_fit');
  });
});
