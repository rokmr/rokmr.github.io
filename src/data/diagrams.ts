/** Conceptual explanations using confirmed public scope, not deployment schematics. */
export type DiagramStageKind = 'input' | 'process' | 'store' | 'check' | 'output';
export type DiagramStage = {
  id: string;
  title: string;
  detail: string;
  kind: DiagramStageKind;
};
export type DiagramLane = { id: string; label: string; stages: DiagramStage[] };
export type TechnicalDiagramSpec = {
  id: string;
  caseStudyId: string;
  afterSection: string;
  title: string;
  caption: string;
  lanes: DiagramLane[];
};

export const technicalDiagrams: TechnicalDiagramSpec[] = [
  {
    id: 'support-answer-flow', caseStudyId: 'agentic-rag', afterSection: 'My contribution',
    title: 'From question to cited answer',
    caption: 'Simplified answer path. Source-priority branches and corrective retries are omitted; the arrows show information flow, not elapsed time.',
    lanes: [{ id: 'answer', label: 'Answer path', stages: [
      { id: 'question', kind: 'input', title: 'Question', detail: 'A support question' },
      { id: 'prepare', kind: 'process', title: 'Prepare query', detail: 'Shared reformulation and embedding' },
      { id: 'retrieve', kind: 'process', title: 'Retrieve', detail: 'Dense + sparse search' },
      { id: 'check', kind: 'check', title: 'Check evidence', detail: 'Relevance and confidence gating' },
      { id: 'answer', kind: 'output', title: 'Cited answer', detail: 'Generation grounded in retrieved sources' },
    ] }],
  },
  {
    id: 'almanac-document-flow', caseStudyId: 'almanac', afterSection: 'Engineering',
    title: 'Documents and questions',
    caption: 'Two simplified paths. Retrieval uses the indexed knowledge produced by ingestion. This describes the intended local workflow; isolated-VM testing and offline-install validation are reported separately below.',
    lanes: [
      { id: 'ingestion', label: 'Document ingestion', stages: [
        { id: 'documents', kind: 'input', title: 'Documents', detail: 'The selected corpus' },
        { id: 'parse', kind: 'process', title: 'Parse & structure', detail: 'Layout, OCR, tables and figures' },
        { id: 'embed', kind: 'process', title: 'Chunk & embed', detail: 'Prepare searchable passages' },
        { id: 'index', kind: 'store', title: 'Knowledge index', detail: 'Indexed passages for retrieval' },
      ] },
      { id: 'questions', label: 'Question answering', stages: [
        { id: 'question', kind: 'input', title: 'Question', detail: 'A document question' },
        { id: 'reformulate', kind: 'process', title: 'Reformulate', detail: 'Prepare the retrieval query' },
        { id: 'retrieve', kind: 'process', title: 'Retrieve & rerank', detail: 'Select context from the index' },
        { id: 'answer', kind: 'output', title: 'Cited answer', detail: 'Local generation with sources' },
      ] },
    ],
  },
  {
    id: 'inference-planning-flow', caseStudyId: 'inference-planner', afterSection: 'Predictions',
    title: 'Plan before trial deployment',
    caption: 'Predictions inform configuration choices. Token-cost estimates use the supplied GPU cost per hour and predicted throughput. This planning path ends with recommendations. I deploy workloads afterward using the selected configuration; the planner does not deploy automatically.',
    lanes: [{ id: 'planning', label: 'Decision-support path', stages: [
      { id: 'inputs', kind: 'input', title: 'Specify inputs', detail: 'Model, GPU, workload and GPU cost/hour' },
      { id: 'predict', kind: 'process', title: 'Predict', detail: 'KV cache, TTFT, TPOT and throughput' },
      { id: 'compare', kind: 'check', title: 'Compare choices', detail: 'Hardware and inference settings' },
      { id: 'recommend', kind: 'output', title: 'Recommend', detail: 'Configuration choices and estimated token costs' },
    ] }],
  },
];
