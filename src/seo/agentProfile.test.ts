import { describe, expect, it } from 'vitest';
import { agentProfileMarkdown, publicAgentProfile } from './agentProfile';
import { caseStudies } from '../data/caseStudies';
import { renderHead } from './head';

describe('public agent discovery', () => {
  it('links every case study and preserves calibration limitations beside planner results', () => {
    for (const study of caseStudies) expect(agentProfileMarkdown).toContain(`/work/${study.id}/`);
    expect(agentProfileMarkdown).toContain('25/25');
    expect(agentProfileMarkdown).toContain('partly in-sample');
    expect(agentProfileMarkdown).toContain('mean absolute percentage error');
    expect(renderHead('/')).toContain('https://rohit.vision/llms.txt');
  });
  it('exports only reviewed public records without retired benchmark claims', () => {
    const serialized = JSON.stringify(publicAgentProfile) + agentProfileMarkdown;
    for (const forbidden of ['privateNotes', 'user-notes', 'content/private', 'vllm_fit',
      'Analytic Capacity and Latency Planning', 'earlier-h100-validation-envelope', 'all 7 checks']) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(serialized).toContain('rohitkumar.iisc@gmail.com');
  });
});
