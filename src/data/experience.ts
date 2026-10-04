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
      'Designed a modified CRAG + controllable ReAct agent as the shared base architecture across all knowledge-base agents, then cut pipeline cost to ~1/3 of baseline by deduplicating reformulation/embedding calls into a shared graph node',
      'Built a two-tier eval framework - retrieval-confidence + CRAG-score gating pre-generation, RAGAS groundedness scoring post-generation - and hand-curated ground truth after LLM-generated references proved unreliable',
      'Built a custom online-learning BM25 index (incremental update/unlearn) to close organizational-vocabulary gaps in dense retrieval, after CPU constraints ruled out reranking and self-hosted embeddings',
      'Replaced single-pass image captioning, which failed on flowcharts and screenshots, with a two-stage classify-then-caption pipeline after OCR and multi-vector (ColPali-style) embeddings proved unreliable or too resource-heavy',
      'Replaced per-file-format ingestion pipelines with a normalized-markdown intermediate layer, cutting new-format onboarding effort by ~50%',
      'Migrated authentication from password login, which was being brute-forced, to SSO via existing console sessions, and enforced write/delete protection in application code where the source API exposed no granular permissions',
      'Built a self-healing sync mechanism keeping the file system, vector store, and dashboard consistent under concurrent updates from multiple external sources, with automatic recovery after partial failures',
    ],
    tech: ['LangGraph', 'CRAG', 'BM25', 'RAGAS', 'Qdrant', 'Langfuse', 'SSO/RBAC', 'Docker'],
  },
  {
    title: 'Research Engineer',
    company: 'Avataar AI',
    date: 'Jul 2024 - Apr 2025',
    location: 'Bangalore, India',
    bullets: [
      'Built end-to-end lifestyle image generation pipeline using Flux Model and ControlNets',
      'Modified diffusion sampling for improved object reconstruction with intrinsic decomposition',
      'Developed classification systems using CLIP, BLIP2, and Qwen2.5 for low-data scenarios',
      'Enhanced segmentation accuracy with BiRefNet and SAM + YOLO-world integration',
    ],
    tech: ['Flux', 'ControlNet', 'Diffusion', 'CLIP', 'SAM', 'YOLO'],
  },
  {
    title: 'Teaching Assistant',
    company: 'IISc Bangalore - Signal Processing',
    date: 'Jan 2024 - Apr 2024',
    location: 'Bangalore, India',
    bullets: [
      'Integrated continual learning frameworks (L2P, DualPrompt) to mitigate catastrophic forgetting',
      'Built self-supervised models using MoCo and SimCLR for visual representation learning',
      'Developed adaptive prompt-based learning with dynamic token expansion',
    ],
    tech: ['L2P', 'DualPrompt', 'MoCo', 'SimCLR', 'PyTorch'],
  },
  {
    title: 'Teaching Assistant',
    company: 'IISc Bangalore - Digital Image Processing',
    date: 'Aug 2023 - Dec 2023',
    location: 'Bangalore, India',
    bullets: [
      'Developed DFT-based frequency domain filtering for image denoising and enhancement',
      'Implemented SIFT and Normalized Cut for feature detection and segmentation',
      'Optimized deep learning models using EfficientNet-B0 with custom classifiers',
    ],
    tech: ['DFT', 'SIFT', 'EfficientNet', 'OpenCV', 'NumPy'],
  },
];
