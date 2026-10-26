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
  id: string;
  roleId?: string;
  problem?: string;
  contribution?: string;
  outcome?: string;
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
    id: 'tacle',
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
      'Exemplar-free semi-supervised class-incremental learning with task-adaptive thresholds, class-aware losses and classifier alignment. Evaluated on CIFAR-10, CIFAR-100 and ImageNet-Subset100. WACV 2025; equal contribution.',
    tech: ['PyTorch', 'Continual Learning', 'Semi-supervised', 'WACV 2025'],
  },
  {
    id: 'agentic-rag',
    roleId: 'armada',
    problem: 'Retrieve and evaluate information across multiple knowledge sources.',
    contribution: 'Designed the shared CRAG and controllable ReAct architecture, retrieval evaluation, and an online-learning BM25 index.',
    outcome: 'Removed redundant query reformulation and embedding calls by sharing work across retrieval branches.',
    title: 'Support RAG Agent',
    preview: {
      src: 'assets/images/agentic_rag_preview.svg',
      alt: 'Agentic RAG pipeline: multi-agent LangGraph system with planner, router, retriever, evaluator, and generator stages',
      width: 1024,
      height: 576,
    },
    badge: 'Armada AI',
    description:
      'Multi-agent RAG pipeline with LangGraph orchestrating planner, retriever, evaluator & generator stages. Hybrid search combines dense retrieval with a custom BM25 index over Qdrant.',
    tech: ['LangGraph', 'Qdrant', 'Hybrid Search', 'FastAPI', 'Docker'],
  },
  {
    id: 'lifestyle-generation',
    roleId: 'avataar',
    problem: 'Generate realistic product imagery while preserving the product itself.',
    contribution: 'Built the Flux and ControlNet pipeline and modified diffusion sampling with intrinsic decomposition.',
    outcome: 'Modified diffusion sampling and product relighting were both adopted into Avataar’s production pipeline.',
    title: 'Diffusion-based product imagery',
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
    id: 'virtual-try-on',
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
      'Virtual try-on using Florence2 and IDM-VTON, with a three-stage CAT-TryOff pipeline and a single-stage Any2Any-Tryon/FLUX approach.',
    tech: ['Florence2', 'IDM-VTON', 'CAT-TryOff', 'Any2Any-Tryon', 'FLUX', 'Diffusion'],
  },
  {
    id: 'cricket-shot',
    problem: 'Classify cricket shots from video clips.',
    contribution: 'Built video classification with CLIP embeddings and an LSTM, then fine-tuned VideoMAE.',
    outcome: 'Achieved 66% test accuracy with VideoMAE and made a live demo available on Hugging Face.',
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

/** Curated overview: adding a project does not automatically lengthen the page. */
export const featuredProjectIds = ['agentic-rag', 'lifestyle-generation', 'cricket-shot'] as const;
export const featuredProjects = featuredProjectIds.map((id) => {
  const project = projects.find((entry) => entry.id === id);
  if (!project) throw new Error(`Unknown featured project: ${id}`);
  return project;
});
// TACLE is presented with its full resources under Research.
export const additionalProjects = projects.filter((project) => project.id !== 'tacle' && !featuredProjectIds.some((id) => id === project.id));
