import type { Route } from '../App';
import { site } from '../data/site';
import { homeStructuredData, tacleStructuredData } from './structuredData';

type Meta = { name?: string; property?: string; content: string };
type Link = { rel: string; href: string; type?: string; hreflang?: string; crossorigin?: true };

type HeadSpec = {
  title: string;
  bodyClass?: string;
  meta: Meta[];
  links: Link[];
  jsonLd: unknown;
  /** Extra <script src> tags, used for MathJax on the TACLE page. */
  scripts?: { src: string; async?: true; id?: string }[];
};

const escapeAttr = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeText = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** JSON-LD sits inside a script element, so only `<` needs neutralising. */
const escapeJsonLd = (value: string) => value.replace(/</g, '\\u003c');

const sharedMeta: Meta[] = [
  { name: 'author', content: 'Rohit Kumar' },
  { name: 'theme-color', content: site.themeColor },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:site', content: site.twitterHandle },
  { name: 'twitter:creator', content: site.twitterHandle },
];

const sharedLinks: Link[] = [
  { rel: 'icon', href: '/assets/images/profile.webp', type: 'image/webp' },
  { rel: 'apple-touch-icon', href: '/assets/images/profile.png' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
  {
    rel: 'stylesheet',
    // Exactly the weights the stylesheets use: fewer files, and no
    // browser-synthesised bold for the 600-weight mono (logo, stat values).
    href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
  },
];

const HOME_TITLE = 'Rohit Kumar | AI Engineer - Computer Vision, LLMs & Agentic AI';
const HOME_DESC =
  'Rohit Kumar - AI Engineer & Research Engineer specializing in Computer Vision, LLMs, and Agentic AI systems. IISc Bangalore M.Tech alumnus building production ML at Armada AI. Published at WACV 2025 & CVPR 2026 Workshop (AISTORY). Invited reviewer for NeurIPS 2026, CVPR 2026 & ECCV 2026. GATE AIR 221.';

const home: HeadSpec = {
  title: HOME_TITLE,
  meta: [
    ...sharedMeta,
    { name: 'description', content: HOME_DESC },
    {
      name: 'keywords',
      content:
        'AI Engineer, Research Engineer, LLM Engineer, Machine Learning Engineer, Computer Vision Engineer, Agentic AI, Artificial Intelligence, Deep Learning, Diffusion Models, RAG, LangGraph, PyTorch, IISc Bangalore, Rohit Kumar, ML Engineer, NLP Engineer, Generative AI, WACV 2025, CVPR 2026 Workshop AISTORY, AttriStory, Visual Storytelling, NeurIPS 2026 Reviewer, CVPR 2026 Reviewer, ECCV 2026 Reviewer, Continual Learning, Flux, ControlNet, CLIP, SAM, Qdrant, LangChain, Hybrid Search, rohit.vision',
    },
    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    {
      name: 'googlebot',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    { name: 'bingbot', content: 'index, follow' },
    { property: 'og:title', content: HOME_TITLE },
    {
      property: 'og:description',
      content:
        'AI Engineer building production ML systems at Armada AI. Published at WACV 2025 & CVPR 2026 Workshop (AISTORY). Invited reviewer for NeurIPS, CVPR & ECCV 2026. IISc Bangalore M.Tech, GATE AIR 221.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${site.origin}/` },
    { property: 'og:image', content: `${site.origin}/assets/og-image.png` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    {
      property: 'og:image:alt',
      content:
        'Rohit Kumar - AI Engineer specializing in Computer Vision, LLMs and Agentic AI',
    },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:site_name', content: 'Rohit Kumar - AI Engineer Portfolio' },
    { name: 'twitter:title', content: 'Rohit Kumar | AI Engineer - CV, LLMs & Agentic AI' },
    {
      name: 'twitter:description',
      content:
        'AI Engineer at Armada AI. Published at WACV 2025 & CVPR 2026 Workshop. Invited reviewer for NeurIPS, CVPR & ECCV 2026. IISc Bangalore M.Tech, GATE AIR 221.',
    },
    { name: 'twitter:image', content: `${site.origin}/assets/og-image.png` },
    {
      name: 'twitter:image:alt',
      content:
        'Rohit Kumar - AI Engineer specializing in Computer Vision, LLMs and Agentic AI',
    },
    { name: 'google-site-verification', content: 'google3b0ef55c8cacaba9' },
    { name: 'msvalidate.01', content: '1D933DCB6BB6D4468266D8F65A2F9500' },
  ],
  links: [
    ...sharedLinks,
    { rel: 'canonical', href: `${site.origin}/` },
    { rel: 'alternate', href: `${site.origin}/`, hreflang: 'en' },
    { rel: 'dns-prefetch', href: 'https://api.semanticscholar.org' },
  ],
  jsonLd: homeStructuredData,
};

const TACLE_TITLE =
  'TACLE: Task and Class-aware Exemplar-free Semi-supervised Class Incremental Learning | WACV 2025';

const tacle: HeadSpec = {
  title: TACLE_TITLE,
  bodyClass: 'tacle-route',
  meta: [
    { name: 'author', content: 'Jayateja Kalla, Rohit Kumar, Soma Biswas' },
    { name: 'theme-color', content: site.themeColor },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: site.twitterHandle },
    { name: 'twitter:creator', content: site.twitterHandle },
    {
      name: 'description',
      content:
        'TACLE proposes a novel task-adaptive threshold framework for exemplar-free semi-supervised class incremental learning, achieving SOTA on CIFAR-10, CIFAR-100 & ImageNet-100. Published at WACV 2025 by Jayateja Kalla, Rohit Kumar, and Soma Biswas from IISc Bangalore.',
    },
    {
      name: 'keywords',
      content:
        'TACLE, continual learning, class incremental learning, semi-supervised learning, WACV 2025, exemplar-free, IISc Bangalore, Rohit Kumar, Jayateja Kalla, Soma Biswas, computer vision, deep learning, catastrophic forgetting, CIFAR-100, ImageNet',
    },
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
    { property: 'og:title', content: TACLE_TITLE },
    {
      property: 'og:description',
      content:
        'Novel framework for exemplar-free semi-supervised class incremental learning achieving SOTA on CIFAR-10, CIFAR-100 & ImageNet-100. Published at WACV 2025.',
    },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `${site.origin}/tacle/` },
    { property: 'og:site_name', content: 'Rohit Kumar - AI Engineer' },
    { property: 'og:image', content: `${site.origin}/assets/images/tacle_intro.webp` },
    { property: 'og:image:width', content: '2042' },
    { property: 'og:image:height', content: '821' },
    {
      property: 'og:image:alt',
      content: 'TACLE overview: comparison of CIL, SS-CIL, and EFSS-CIL learning settings',
    },
    { property: 'article:published_time', content: '2025-01-01' },
    { property: 'article:author', content: `${site.origin}/` },
    { property: 'article:section', content: 'Computer Vision' },
    { property: 'article:tag', content: 'Continual Learning' },
    { property: 'article:tag', content: 'Semi-supervised Learning' },
    { property: 'article:tag', content: 'WACV 2025' },
    {
      name: 'twitter:title',
      content:
        'TACLE: Exemplar-free Semi-supervised Class Incremental Learning | WACV 2025',
    },
    {
      name: 'twitter:description',
      content:
        'SOTA results on CIFAR-10, CIFAR-100 & ImageNet-100 without storing previous examples. Published at WACV 2025 from IISc Bangalore.',
    },
    { name: 'twitter:image', content: `${site.origin}/assets/images/tacle_intro.webp` },
    { name: 'twitter:image:alt', content: 'TACLE method overview diagram' },
  ],
  links: [
    ...sharedLinks,
    { rel: 'canonical', href: `${site.origin}/tacle/` },
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    },
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/gh/jpswalsh/academicons@1/css/academicons.min.css',
    },
  ],
  jsonLd: tacleStructuredData,
  scripts: [
    {
      id: 'MathJax-script',
      async: true,
      src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
    },
  ],
};

const specs: Record<Route, HeadSpec> = { '/': home, '/tacle/': tacle };

export function bodyClassFor(route: Route): string {
  return specs[route].bodyClass ?? '';
}

/** Serialises the head for a route into HTML the prerenderer injects. */
export function renderHead(route: Route): string {
  const spec = specs[route];
  const out: string[] = [`<title>${escapeText(spec.title)}</title>`];

  for (const m of spec.meta) {
    const key = m.name ? `name="${escapeAttr(m.name)}"` : `property="${escapeAttr(m.property!)}"`;
    out.push(`<meta ${key} content="${escapeAttr(m.content)}">`);
  }

  for (const l of spec.links) {
    const attrs = [`rel="${escapeAttr(l.rel)}"`, `href="${escapeAttr(l.href)}"`];
    if (l.type) attrs.push(`type="${escapeAttr(l.type)}"`);
    if (l.hreflang) attrs.push(`hreflang="${escapeAttr(l.hreflang)}"`);
    if (l.crossorigin) attrs.push('crossorigin');
    out.push(`<link ${attrs.join(' ')}>`);
  }

  out.push(
    `<script type="application/ld+json">${escapeJsonLd(JSON.stringify(spec.jsonLd))}</script>`,
  );

  for (const s of spec.scripts ?? []) {
    const attrs = [`src="${escapeAttr(s.src)}"`];
    if (s.id) attrs.unshift(`id="${escapeAttr(s.id)}"`);
    if (s.async) attrs.push('async');
    out.push(`<script ${attrs.join(' ')}></script>`);
  }

  return out.join('\n    ');
}
