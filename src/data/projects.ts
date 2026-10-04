import type { IconName } from '../components/Icon';

export type Preview = {
  /** Rendered as <img>. When `webp` is set it becomes the <picture> source. */
  src: string;
  webp?: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  title: string;
  preview: Preview;
  /** Icon links in the card header. */
  links?: { href: string; icon: IconName; title: string; ariaLabel: string }[];
  /** Shown instead of links when the work is proprietary. */
  badge?: string;
  description: string;
  tech: string[];
};

export const projects: Project[] = [
  {
    title: 'TACLE',
    preview: {
      src: 'assets/images/tacle_intro.png',
      webp: 'assets/images/tacle_intro.webp',
      alt: 'TACLE overview diagram: comparison of CIL, SS-CIL, and EFSS-CIL learning settings',
      width: 2042,
      height: 821,
    },
    links: [
      {
        href: 'https://github.com/rokmr/TACLE',
        icon: 'github',
        title: 'GitHub',
        ariaLabel: 'TACLE GitHub repository',
      },
      {
        href: 'https://arxiv.org/pdf/2407.08041',
        icon: 'file',
        title: 'Paper',
        ariaLabel: 'TACLE paper PDF',
      },
      {
        href: 'https://rohit.vision/tacle/',
        icon: 'globe',
        title: 'Website',
        ariaLabel: 'TACLE project website',
      },
    ],
    description:
      'Exemplar-free semi-supervised class incremental learning. SOTA on CIFAR-10, CIFAR-100 & ImageNet-100 without storing any previous examples. Published at WACV 2025.',
    tech: ['PyTorch', 'Continual Learning', 'Semi-supervised', 'WACV 2025'],
  },
  {
    title: 'Agentic RAG System',
    preview: {
      src: 'assets/images/agentic_rag_preview.svg',
      alt: 'Agentic RAG pipeline: multi-agent LangGraph system with planner, router, retriever, evaluator, and generator stages',
      width: 1024,
      height: 576,
    },
    badge: 'Armada AI',
    description:
      'Multi-agent RAG pipeline with LangGraph orchestrating planner, retriever, evaluator & generator stages. Hybrid search via dense + BM25 + RRF over Qdrant with Jina reranking.',
    tech: ['LangGraph', 'Qdrant', 'Hybrid Search', 'FastAPI', 'Docker'],
  },
  {
    title: 'Lifestyle Image Generation',
    preview: {
      src: 'assets/images/lifestyle_gen_preview.svg',
      alt: 'Lifestyle image generation pipeline: Input, Segment (SAM+YOLO), Condition (ControlNet), Denoise (Flux), Output',
      width: 1024,
      height: 576,
    },
    badge: 'Avataar AI',
    description:
      'Product image generation pipeline on Flux + ControlNets. Modified diffusion sampling with intrinsic decomposition for photorealistic object reconstruction.',
    tech: ['Flux', 'ControlNet', 'Diffusion', 'SAM', 'CLIP'],
  },
  {
    title: 'Virtual Try-On',
    preview: {
      src: 'assets/images/vton_preview.png',
      webp: 'assets/images/vton_preview.webp',
      alt: 'Virtual Try-On pipeline: 3-stage garment transfer using Florence2 and IDM-VTON',
      width: 1024,
      height: 562,
    },
    links: [
      {
        href: 'assets/report/vton.pdf',
        icon: 'file',
        title: 'Report',
        ariaLabel: 'Virtual Try-On report PDF',
      },
    ],
    description:
      'Three-stage Virtual Try-On pipeline combining Florence2 and IDM-VTON for automated garment transfer.',
    tech: ['Florence2', 'IDM-VTON', 'FLUX', 'Diffusion'],
  },
  {
    title: 'Cricket-Shot Predictor',
    preview: {
      src: 'assets/images/cricket_shot_preview.png',
      webp: 'assets/images/cricket_shot_preview.webp',
      alt: 'Cricket shot classification using CLIP embeddings and VideoMAE fine-tuning',
      width: 1024,
      height: 1024,
    },
    links: [
      {
        href: 'https://github.com/rokmr/Computer-Vision/tree/main/Video-Processing/VideoClassification',
        icon: 'github',
        title: 'GitHub',
        ariaLabel: 'Cricket-Shot Predictor GitHub repository',
      },
      {
        href: 'https://huggingface.co/spaces/rokmr/cricketshot',
        icon: 'play',
        title: 'Demo',
        ariaLabel: 'Cricket-Shot Predictor live demo',
      },
    ],
    description:
      'LSTM-based video classification using CLIP embeddings. Fine-tuned VideoMAE achieving 66% accuracy on cricket shots. Live demo on HuggingFace Spaces.',
    tech: ['LSTM', 'CLIP', 'VideoMAE', 'HuggingFace'],
  },
];
