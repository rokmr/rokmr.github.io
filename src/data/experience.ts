import { publicRoleFor } from './profile';

export type Experience = {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  date: string;
  location: string;
  current?: boolean;
  managers?: { name: string; href: string }[];
  bullets: string[];
  /** Explicit public résumé highlights; adding a bullet does not silently reorder the résumé. */
  resumeBulletIndexes?: number[];
  tech: string[];
};

const roleDetails: Experience[] = [
  {
    id: 'armada',
    title: 'AI Engineer',
    company: 'Armada AI',
    companyUrl: 'https://www.armada.ai/',
    date: 'Jun 2025 - Present',
    location: 'Trivandrum, India',
    current: true,
    managers: [{ name: 'Naveen Nair', href: 'https://www.linkedin.com/in/naveen-sudhakaran-nair' }],
    bullets: [
      'Sole owner of the Support RAG Agent, built from an empty repository and deployed for Armada’s internal Customer Support team',
      'Reduced Support Agent cost per query/run to approximately one-third of the initial graph on similar workloads by sharing reformulation and embedding across retrieval branches',
      'Fine-tuned models for Almanac using SFT, LoRA and QLoRA',
      'Worked on model quantization using AWQ, GPTQ and WxAy weight/activation precision configurations',
      'Established retrieval-stage CRAG gating and end-to-end RAGAS evaluation against curated ground truth',
      'Enabled incremental sparse-index updates and removal with online-learning BM25, addressing organizational vocabulary without full re-indexing',
      'Replaced single-pass image captioning with a two-stage classify-then-caption pipeline for document images, including flowcharts and screenshots',
      'Replaced per-format ingestion pipelines with a normalized-Markdown intermediate representation shared across file formats',
      'Sole engineering owner of Almanac’s local document-Q&A application, including model serving, ingestion, retrieval and SFT/LoRA/QLoRA fine-tuning',
      'Built an LLM inference planner with spec-sheet predictions and optional GPU-profile calibration; used its predictions to choose serving configurations, then deployed them',
    ],
    resumeBulletIndexes: [0, 1, 9, 8, 5, 4],
    tech: ['LangGraph', 'CRAG', 'BM25', 'RAGAS', 'Qdrant', 'Langfuse', 'Kubernetes', 'Ray', 'Docker'],
  },
  {
    id: 'avataar',
    managers: [
      { name: 'Sohil Shah', href: 'https://www.linkedin.com/in/sohilas' },
      { name: 'Shubham Goel', href: 'https://www.linkedin.com/in/shubham-goel-59860a3a' },
    ],
    title: 'Research Engineer',
    company: 'Avataar AI',
    companyUrl: 'https://www.avataar.ai/',
    date: 'Jul 2024 - Apr 2025',
    location: 'Bangalore, India',
    bullets: [
      'Developed diffusion-sampling changes for product shape and consistency and intrinsic-decomposition-based relighting for lighting consistency; both adopted into Avataar’s production pipeline',
      'Fine-tuned sparse-view-conditioned Stable Diffusion models for novel-view synthesis, modifying image conditioning and running distributed training with SLURM',
      'Built classification for low-data scenarios with CLIP, BLIP2, and Qwen2.5',
      'Worked on segmentation using BiRefNet and SAM with YOLO-world',
    ],
    resumeBulletIndexes: [0, 1],
    tech: ['Flux', 'ControlNet', 'Diffusion', 'Distributed training', 'SLURM', 'CLIP', 'SAM', 'YOLO'],
  },
  {
    // The two TA stints were consecutive at the same institution, so they read
    // as one entry rather than two near-identical cards.
    id: 'iisc',
    title: 'Teaching Assistant',
    company: 'IISc Bangalore',
    companyUrl: 'https://iisc.ac.in/',
    date: 'Aug 2023 - Apr 2024',
    location: 'Bangalore, India',
    bullets: [
      'Teaching assistant for Digital Image Processing and Signal System in Practice',
      'Worked on continual learning (L2P, DualPrompt), self-supervised learning (MoCo, SimCLR), frequency-domain filtering and image features',
    ],
    resumeBulletIndexes: [0, 1],
    tech: ['L2P', 'DualPrompt', 'MoCo', 'SimCLR', 'PyTorch', 'OpenCV'],
  },
];

/** Public master supplies identity; detailed legacy bullets remain during migration. */
export const experience: Experience[] = roleDetails.map((job) => {
  const record = publicRoleFor(job.id);
  return record ? { ...job, title: record.title, company: record.organization ?? job.company } : job;
});

/** The role marked `current`, and the most recent one before it. */
export const currentRole = experience.find((e) => e.current) ?? experience[0]!;
export const previousRole = experience.find((e) => e !== currentRole && !e.current)!;
