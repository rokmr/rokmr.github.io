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
      'Built and deployed the Support RAG Agent for Armada’s internal Customer Support team (sole owner). Sole engineering owner of Almanac, an ongoing application designed for air-gapped document Q&A',
      'Designed the Support Agent’s CRAG + controllable ReAct workflow; shared reformulation and embedding across branches reduced cost per query/run to approximately one-third of the initial graph on similar workloads',
      'Fine-tuned models for Almanac using SFT, LoRA and QLoRA',
      'Worked on model quantization using AWQ, GPTQ and WxAy weight/activation precision configurations',
      'Built Support Agent evaluation at two levels: retrieval-confidence and CRAG-score gating before generation, and RAGAS-based response evaluation against curated ground truth',
      'Built an online-learning BM25 index with incremental update and unlearn, addressing organizational-vocabulary gaps that dense retrieval missed',
      'Replaced single-pass image captioning with a two-stage classify-then-caption pipeline for document images, including flowcharts and screenshots',
      'Replaced per-format ingestion pipelines with a normalized-Markdown intermediate representation shared across file formats',
    ],
    resumeBulletIndexes: [0, 1, 4, 5, 7, 2],
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
      'Built a Flux and ControlNet pipeline for lifestyle product imagery; modified diffusion sampling followed by intrinsic decomposition for product reconstruction and relighting',
      'Continued an existing sparse-view-conditioned diffusion project, fine-tuning a Stable Diffusion model for novel-view synthesis with distributed training and SLURM',
      'Built classification for low-data scenarios with CLIP, BLIP2, and Qwen2.5',
      'Worked on segmentation using BiRefNet and SAM with YOLO-world',
    ],
    resumeBulletIndexes: [0, 1, 2],
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
