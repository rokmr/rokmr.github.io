import { skills } from './skills';
import { experience } from './experience';

// Select for breadth and demonstrated work, rather than the order of new notes.
const selections = [
  { name: 'Retrieval & evaluation', items: ['LangGraph', 'Hybrid Search', 'BM25', 'Evals (RAGAS)', 'Qdrant', 'Langfuse'] },
  { name: 'Training & fine-tuning', items: ['Python', 'PyTorch', 'Supervised fine-tuning (SFT)', 'LoRA', 'QLoRA'] },
  { name: 'Serving & infrastructure', items: ['vLLM', 'Ray', 'Kubernetes', 'Docker', 'SLURM', 'AWQ', 'GPTQ'] },
  { name: 'Vision & generative', items: ['Flux', 'ControlNet', 'CLIP', 'Novel-view Synthesis'] },
];
const verifiedSkills = new Set([...skills.flatMap(group => group.items), ...experience.flatMap(job => job.tech)]);
export const resumeSkills = selections.map(group => ({ ...group, items: group.items.filter(item => verifiedSkills.has(item)) }));
// Research-facing positioning; employment entries retain the actual job titles.
export { professionalHeadline as resumeHeadline } from './positioning';
export const resumeSummary = 'I work on controllable and reliable generation, and on predicting inference performance and serving cost. At Armada AI, I am the sole owner of the Support RAG Agent and sole engineering owner of Almanac. M.Tech in AI, IISc Bangalore; co-first-author work on visual storytelling and learning from limited labels (CVPR 2026 Workshop, WACV 2025).';
export const resumeProjects = [
  { title: 'LLM Inference Planning & Optimization', href: '/work/inference-planner/', summary: 'Engine-independent prediction of KV-cache capacity, latency, throughput and cost for dense, MoE and hybrid architectures. KV-cache capacity exact on 25/25 dense and MoE configurations. Spec-sheet-only predictions need no GPU access. With brief GPU profiling, dense mean error falls from 15.9% to 3.6% for TTFT (n=174) and 13.8% to 5.2% for batched TPOT (n=242). Errors are mean absolute percentages; profiled results are partly in-sample.' },
  { title: 'Document-model evaluation', href: '/work/model-evaluation/', summary: 'Compared table-structure, OCR, layout and embedding models; built interchangeable pipeline components for model selection.' },
];

export { publicationDisplayAuthors as resumePublicationAuthors } from './publications';

/** Published Table 1 results describe the joint work, not an inferred task split. */
export function resumePublicationHighlight(title: string): string {
  return title.startsWith('AttriStory:')
    ? 'Inference-time AttriLoss raised StoryDiffusion VQAScore from 0.8363 to 0.8636 on the AttriStory benchmark.'
    : '92.35% average incremental accuracy on CIFAR-100 with 0.8% labels: +4.12 percentage points over SLCA+FT (ImageNet-pretrained ViT, 10 tasks).';
}
export const appliedResume = {
  headline: 'AI Engineer · LLM Agents & Inference Systems',
  summary: 'AI Engineer at Armada AI with end-to-end ownership of a deployed Support RAG Agent and sole engineering ownership of Almanac. Build grounded agents, evaluation and inference-planning systems; previously worked on diffusion-based vision at Avataar AI.',
  // The applied draft has no separate project card; retain validation once here.
  bulletOverrides: { armada: { 9: 'Built an LLM inference planner and used it to select and deploy serving configurations; spec-sheet KV-cache capacity predictions exact on 25/25 dense and MoE configurations' } } as Record<string, Record<number, string>>,
  bulletIndexes: { armada: [0, 1, 9, 8, 5], avataar: [0, 1] } as Record<string, number[]>,
};
