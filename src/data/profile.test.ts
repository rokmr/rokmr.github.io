import { describe, expect, it } from 'vitest';
import { caseStudies } from './caseStudies';
import { experience } from './experience';
import { publicProfile } from './profile';
import { site } from './site';

const caseRecordIds: Record<string, string> = {
  'agentic-rag': 'armada-support', almanac: 'armada-almanac',
  'inference-planner': 'armada-inference-planner', 'ai-assistant': 'armada-assistant',
  'lifestyle-generation': 'avataar-lifestyle', 'cricket-shot': 'cricket-shot',
  'model-evaluation': 'model-selection-evaluation-pipeline',
  'novel-view-synthesis': 'avataar-lrm-training',
};

describe('public profile consistency', () => {
  it('keeps case-study titles, summaries and ownership wording aligned with the master projection', () => {
    for (const study of caseStudies) {
      const record = publicProfile.records.find(r => r.id === caseRecordIds[study.id]);
      expect(record, study.id).toBeDefined();
      expect(record?.title).toBe(study.title);
      expect(record?.content.summary).toBe(study.summary);
      expect(record?.content.contribution).toBe(study.contribution);
    }
  });
  it('keeps résumé experience and contact aligned with the public projection', () => {
    expect(site.email).toBe('rohitkumar.iisc@gmail.com');
    for (const job of experience) {
      const id = job.id === 'iisc' ? 'iisc-ta' : job.id;
      const record = publicProfile.records.find(r => r.id === id);
      expect(record?.content.contribution).toBe(job.bullets.join('\n'));
    }
    expect(JSON.stringify(publicProfile)).not.toContain('privateNotes');
    expect(JSON.stringify(publicProfile)).not.toContain('Analytic Capacity and Latency Planning');
  });
});
