export type Experience = {
  title: string;
  company: string;
  date: string;
  location: string;
  current?: boolean;
  bullets: string[];
  tech: string[];
};

export const experience: Experience[] = [
  {
    title: 'AI Engineer',
    company: 'Armada AI',
    date: 'Jun 2025 - Present',
    location: 'Trivandrum, India',
    current: true,
    bullets: [
      'Designed the shared CRAG + controllable ReAct architecture behind every knowledge-base agent, cutting pipeline cost to ~1/3 of baseline by deduplicating reformulation and embedding calls into one graph node',
      'Built a two-tier eval framework: retrieval-confidence and CRAG-score gating before generation, RAGAS groundedness scoring after, against hand-curated ground truth',
      'Built an online-learning BM25 index with incremental update and unlearn, closing organizational-vocabulary gaps that dense retrieval missed',
      'Replaced single-pass image captioning with a two-stage classify-then-caption pipeline, fixing the flowcharts and screenshots it failed on',
      'Replaced per-format ingestion pipelines with a normalized-markdown layer, cutting new-format onboarding effort by ~50%',
    ],
    tech: ['LangGraph', 'CRAG', 'BM25', 'RAGAS', 'Qdrant', 'Langfuse', 'Docker'],
  },
  {
    title: 'Research Engineer',
    company: 'Avataar AI',
    date: 'Jul 2024 - Apr 2025',
    location: 'Bangalore, India',
    bullets: [
      'Built the lifestyle image generation pipeline on Flux and ControlNets',
      'Modified diffusion sampling with intrinsic decomposition for better object reconstruction',
      'Built classification for low-data scenarios with CLIP, BLIP2, and Qwen2.5',
      'Improved segmentation accuracy with BiRefNet and SAM + YOLO-world',
    ],
    tech: ['Flux', 'ControlNet', 'Diffusion', 'CLIP', 'SAM', 'YOLO'],
  },
  {
    // The two TA stints were consecutive at the same institution, so they read
    // as one entry rather than two near-identical cards.
    title: 'Teaching Assistant',
    company: 'IISc Bangalore - Signal Processing, Digital Image Processing',
    date: 'Aug 2023 - Apr 2024',
    location: 'Bangalore, India',
    bullets: [
      'Built reference implementations for continual learning (L2P, DualPrompt) and self-supervised pretraining (MoCo, SimCLR)',
      'Designed and graded assignments across both courses, from frequency-domain filtering and SIFT to deep classification',
    ],
    tech: ['L2P', 'DualPrompt', 'MoCo', 'SimCLR', 'PyTorch', 'OpenCV'],
  },
];

/** The role marked `current`, and the most recent one before it. */
export const currentRole = experience.find((e) => e.current) ?? experience[0]!;
export const previousRole = experience.find((e) => e !== currentRole && !e.current)!;
