import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { technicalDiagrams } from './diagrams';
import { caseStudyFor } from './caseStudies';
import { CaseStudy } from '../pages/CaseStudy';
import { TechnicalDiagram } from '../components/TechnicalDiagram';

describe('technical diagrams', () => {
  it('connects each explanation to a real case-study section and renders its caption', () => {
    expect(new Set(technicalDiagrams.map(d => d.id)).size).toBe(technicalDiagrams.length);
    for (const diagram of technicalDiagrams) {
      const study = caseStudyFor(diagram.caseStudyId);
      expect(study?.sections.some(s => s.heading === diagram.afterSection)).toBe(true);
      for (const lane of diagram.lanes) {
        expect(lane.stages.length).toBeGreaterThan(1);
        expect(new Set(lane.stages.map(s => s.id)).size).toBe(lane.stages.length);
      }
      const html = renderToStaticMarkup(createElement(CaseStudy, { id: diagram.caseStudyId }));
      expect(html).toContain(diagram.title.replace(/&/g, '&amp;'));
      expect(html).toContain(diagram.caption);
    }
  });
  it('keeps labels distinct if the same diagram is reused twice', () => {
    const example = technicalDiagrams[0]!;
    const html = renderToStaticMarkup(createElement('div', null,
      createElement(TechnicalDiagram, { diagram: example }),
      createElement(TechnicalDiagram, { diagram: example }),
    ));
    const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const [, target] of html.matchAll(/aria-labelledby="([^"]+)"/g)) expect(ids).toContain(target);
  });
});
