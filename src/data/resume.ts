import { skills } from './skills';

// Select for breadth and demonstrated work, rather than the order of new notes.
const selections = [
  { name: 'AI/ML', items: ['LLMs', 'RAG', 'Agentic AI', 'Computer Vision', 'Diffusion Models', 'NLP'] },
  { name: 'Model development', items: ['PyTorch', 'Supervised fine-tuning (SFT)', 'LoRA', 'QLoRA', 'Distributed training'] },
  { name: 'Engineering', items: ['Python', 'SQL', 'LangGraph', 'Hybrid Search', 'Evals (RAGAS)', 'FastAPI', 'Qdrant', 'Kubernetes', 'Docker', 'SLURM'] },
];
const verifiedSkills = new Set(skills.flatMap(group => group.items));
export const resumeSkills = selections.map(group => ({ ...group, items: group.items.filter(item => verifiedSkills.has(item)) }));
export { professionalHeadline as resumeHeadline } from './positioning';
export const resumeSummary = 'AI Engineer at Armada AI, building retrieval and evaluation systems. Sole owner of its Support RAG Agent and sole engineering owner of Almanac, its on-device document Q&A application. Previously worked on diffusion-based product imagery and novel-view synthesis at Avataar AI. M.Tech in AI from IISc Bangalore; research published at WACV 2025 and CVPR 2026 Workshop.';
export const resumeProjects = [
  { title: 'LLM Inference Planning & Optimization', href: '/work/inference-planner/', summary: 'Built a planner to predict KV-cache requirements, latency, throughput and token costs before trial deployment. Selected hardware and serving configurations, then deployed inference workloads.' },
  { title: 'Document-model evaluation', href: '/work/model-evaluation/', summary: 'Compared table-structure, OCR, layout and embedding models; built interchangeable pipeline components for model selection.' },
  { title: 'Novel-view synthesis', href: '/work/novel-view-synthesis/', summary: 'Continued an existing Zero123-like diffusion project at Avataar, with initial setup by a senior engineer. Fine-tuned sparse-image-conditioned models using distributed training and SLURM; used all 32 H100 GPUs for a few days.' },
];

export { publicationDisplayAuthors as resumePublicationAuthors } from './publications';
