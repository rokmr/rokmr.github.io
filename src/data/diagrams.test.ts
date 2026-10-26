import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sprite from '../../public/assets/icons/streamline-core.svg?raw';
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
  it('ships the icon symbols used by every diagram and includes visible credit', () => {
    for (const diagram of technicalDiagrams) {
      for (const stage of diagram.lanes.flatMap(lane => lane.stages)) expect(sprite).toContain(`id="${stage.icon}"`);
      const html = renderToStaticMarkup(createElement(CaseStudy, { id: diagram.caseStudyId }));
      expect(html).toContain('Streamline icons');
      expect(html).toContain('https://creativecommons.org/licenses/by/4.0/');
    }
  });
  it('connects real stages in reading order across lanes', () => {
    for (const diagram of technicalDiagrams) for (const connection of diagram.connections ?? []) {
      const source = diagram.lanes.findIndex(lane => lane.id === connection.fromLane);
      const target = diagram.lanes.findIndex(lane => lane.id === connection.toLane);
      expect(source).toBeGreaterThanOrEqual(0);
      expect(target).toBeGreaterThan(source);
      expect(diagram.lanes[source]!.stages.some(stage => stage.id === connection.fromStage)).toBe(true);
      expect(diagram.lanes[target]!.stages.some(stage => stage.id === connection.toStage)).toBe(true);
      const html = renderToStaticMarkup(createElement(TechnicalDiagram, { diagram }));
      expect(html).toContain(connection.label);
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
