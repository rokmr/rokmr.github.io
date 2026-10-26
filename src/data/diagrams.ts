import type { DiagramIconName } from '../components/DiagramIcon';
/** Conceptual explanations using confirmed public scope, not deployment schematics. */
export type DiagramStageKind = 'input' | 'process' | 'store' | 'check' | 'output';
export type DiagramStage = {
  id: string;
  title: string;
  detail: string;
  kind: DiagramStageKind;
  icon: DiagramIconName;
};
export type DiagramLane = { id: string; label: string; stages: DiagramStage[] };
export type TechnicalDiagramSpec = {
  id: string;
  caseStudyId: string;
  afterSection: string;
  title: string;
  caption: string;
  lanes: DiagramLane[];
  /** Explicit relationships between otherwise separate sequences. */
  connections?: { fromLane: string; fromStage: string; toLane: string; toStage: string; label: string }[];
};

export const technicalDiagrams: TechnicalDiagramSpec[] = [
  {
    id: 'support-answer-flow', caseStudyId: 'agentic-rag', afterSection: 'My contribution',
    title: 'From question to cited answer',
    caption: 'Simplified answer path. Source-priority branches and corrective retries are omitted; the arrows show information flow, not elapsed time.',
    lanes: [{ id: 'answer', label: 'Answer path', stages: [
      { id: 'question', icon: 'help-chat-2', kind: 'input', title: 'Question', detail: 'A support question' },
      { id: 'prepare', icon: 'pencil', kind: 'process', title: 'Prepare query', detail: 'Shared reformulation and embedding' },
      { id: 'retrieve', icon: 'magnifying-glass', kind: 'process', title: 'Retrieve', detail: 'Dense + sparse search' },
      { id: 'check', icon: 'filter-2', kind: 'check', title: 'Check evidence', detail: 'Relevance and confidence gating' },
      { id: 'answer', icon: 'new-file', kind: 'output', title: 'Cited answer', detail: 'Generation grounded in retrieved sources' },
    ] }],
  },
  {
    id: 'almanac-document-flow', caseStudyId: 'almanac', afterSection: 'Engineering',
    title: 'Documents and questions',
    caption: 'Ingestion prepares the knowledge used during question answering. This is the local workflow; installation and evaluation status are described below.',
    connections: [{ fromLane: 'ingestion', fromStage: 'index', toLane: 'questions', toStage: 'retrieve', label: 'Supplies indexed passages' }],
    lanes: [
      { id: 'ingestion', label: 'Document ingestion', stages: [
        { id: 'documents', icon: 'multiple-file-2', kind: 'input', title: 'Documents', detail: 'The selected corpus' },
        { id: 'parse', icon: 'page-setting', kind: 'process', title: 'Parse & structure', detail: 'Layout, OCR, tables and figures' },
        { id: 'embed', icon: 'layers-1', kind: 'process', title: 'Chunk & embed', detail: 'Prepare searchable passages' },
        { id: 'index', icon: 'database', kind: 'store', title: 'Knowledge index', detail: 'Indexed passages for retrieval' },
      ] },
      { id: 'questions', label: 'Question answering', stages: [
        { id: 'question', icon: 'help-chat-2', kind: 'input', title: 'Question', detail: 'A document question' },
        { id: 'reformulate', icon: 'pencil', kind: 'process', title: 'Reformulate', detail: 'Prepare the retrieval query' },
        { id: 'retrieve', icon: 'magnifying-glass', kind: 'process', title: 'Retrieve & rerank', detail: 'Select context from the index' },
        { id: 'answer', icon: 'new-file', kind: 'output', title: 'Cited answer', detail: 'Local generation with sources' },
      ] },
    ],
  },
  {
    id: 'inference-planning-flow', caseStudyId: 'inference-planner', afterSection: 'Predictions',
    title: 'From inference planning to deployment',
    caption: 'Spec-sheet predictions need no GPU access; a GPU profile can optionally calibrate predictions. The planner recommends settings using the supplied GPU cost per hour. I choose the serving configuration and deploy it afterward.',
    connections: [{ fromLane: 'planning', fromStage: 'recommend', toLane: 'deployment', toStage: 'configuration', label: 'Engineering handoff' }],
    lanes: [{ id: 'planning', label: 'Planning tool', stages: [
      { id: 'inputs', icon: 'input-box', kind: 'input', title: 'Specify inputs', detail: 'Model, GPU, workload, GPU cost/hour; optional GPU profile' },
      { id: 'predict', icon: 'computer-chip-1', kind: 'process', title: 'Predict', detail: 'KV cache, TTFT, TPOT and throughput' },
      { id: 'compare', icon: 'filter-2', kind: 'check', title: 'Compare choices', detail: 'Hardware and inference settings' },
      { id: 'recommend', icon: 'cog', kind: 'output', title: 'Recommend', detail: 'Configuration choices and estimated token costs' },
    ] }, { id: 'deployment', label: 'My engineering work', stages: [
      { id: 'configuration', icon: 'cog', kind: 'input', title: 'Selected configuration', detail: 'Model, GPU and serving settings' },
      { id: 'deploy', icon: 'database-server-1', kind: 'output', title: 'Deploy workload', detail: 'Hands-on deployment after planning' },
    ] }],
  },
];
