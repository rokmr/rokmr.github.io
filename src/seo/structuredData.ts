import { site, socialUrls } from '../data/site';

const PERSON_ID = `${site.origin}/#person`;

const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Rohit Kumar',
  givenName: 'Rohit',
  familyName: 'Kumar',
  jobTitle: ['AI Engineer', 'Research Engineer', 'Machine Learning Engineer'],
  description:
    'AI Engineer and Research Engineer specializing in Computer Vision, Large Language Models, Agentic AI, and Diffusion Models. Building production ML systems at Armada AI. IISc Bangalore M.Tech alumnus, GATE AIR 221. Published at WACV 2025 and CVPR 2026 Workshop (AISTORY). Invited reviewer for NeurIPS 2026, CVPR 2026, and ECCV 2026.',
  url: `${site.origin}/`,
  email: site.email,
  image: {
    '@type': 'ImageObject',
    url: `${site.origin}/assets/images/profile.webp`,
    width: 440,
    height: 440,
  },
  sameAs: [
    socialUrls.github,
    socialUrls.linkedin,
    socialUrls.x,
    'https://scholar.google.com/citations?user=7N8THZgAAAAJ&hl=en',
    socialUrls.huggingface,
  ],
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Indian Institute of Science (IISc) Bangalore',
      url: 'https://iisc.ac.in',
    },
    { '@type': 'CollegeOrUniversity', name: 'Bhagalpur College of Engineering' },
  ],
  knowsAbout: [
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Vision',
    'Large Language Models',
    'LLM Engineering',
    'Agentic AI',
    'Diffusion Models',
    'Deep Learning',
    'Natural Language Processing',
    'RAG Systems',
    'Hybrid Search',
    'Sentence Transformers',
    'BM25',
    'PyTorch',
    'LangGraph',
    'LangChain',
    'FastAPI',
    'Qdrant',
    'Playwright',
    'Langfuse',
    'Docker',
    'Helm',
    'Generative AI',
    'Continual Learning',
    'Visual Storytelling',
    'CLIP',
    'SAM',
    'YOLO',
    'Flux',
    'ControlNet',
    'Reinforcement Learning',
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'M.Tech in Artificial Intelligence',
      credentialCategory: 'degree',
      recognizedBy: {
        '@type': 'CollegeOrUniversity',
        name: 'Indian Institute of Science (IISc) Bangalore',
      },
    },
    { '@type': 'EducationalOccupationalCredential', name: 'GATE EE 2022 - AIR 221' },
    { '@type': 'EducationalOccupationalCredential', name: 'GATE IN 2022 - AIR 227' },
  ],
  memberOf: ['NeurIPS 2026', 'CVPR 2026', 'ECCV 2026'].map((name) => ({
    '@type': 'ProgramMembership',
    programName: 'Invited Reviewer',
    hostingOrganization: { '@type': 'Organization', name },
  })),
  worksFor: { '@type': 'Organization', name: 'Armada AI', url: 'https://armada-ai.com' },
  nationality: { '@type': 'Country', name: 'India' },
};

export const homeStructuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: '2024-12-01',
    dateModified: '2025-07-18',
    mainEntity: person,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rohit Kumar - AI Engineer Portfolio',
    url: `${site.origin}/`,
    description:
      'Portfolio of Rohit Kumar, AI Engineer specializing in Computer Vision, LLMs, and Agentic AI systems. Published at WACV 2025 and CVPR 2026 Workshop.',
    author: { '@id': PERSON_ID },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site.origin}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: "Rohit Kumar's AI Research Blog",
    url: site.blogUrl,
    description:
      'Deep dives into Computer Vision, LLMs, Diffusion Models, and Agentic AI. Technical tutorials with math, code, and interactive visualizations.',
    author: { '@id': PERSON_ID },
    blogPost: [
      {
        '@type': 'BlogPosting',
        headline: 'Flash Attention: Making Transformers Scale',
        url: 'https://blogs.rohit.vision/posts/flash-attention-scaling/',
        datePublished: '2024-12-18',
      },
      {
        '@type': 'BlogPosting',
        headline: 'Transformer Attention: A Mathematical Deep Dive',
        url: 'https://blogs.rohit.vision/posts/transformer-attention-deep-dive/',
        datePublished: '2024-12-17',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline:
      'TACLE: Task and Class-aware Exemplar-free Semi-supervised Class Incremental Learning',
    author: [
      { '@type': 'Person', name: 'Jayateja Kalla' },
      { '@type': 'Person', name: 'Rohit Kumar', '@id': PERSON_ID },
      { '@type': 'Person', name: 'Soma Biswas' },
    ],
    datePublished: '2025',
    publisher: { '@type': 'Organization', name: 'IEEE/CVF' },
    isPartOf: { '@type': 'PublicationEvent', name: 'WACV 2025' },
    url: `${site.origin}/tacle/`,
    sameAs: 'https://arxiv.org/abs/2407.08041',
    image: `${site.origin}/assets/images/tacle_intro.webp`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline:
      'AttriStory: Fine-Grained Attribute Realization for Visual Storytelling with Diffusion Models',
    author: [
      { '@type': 'Person', name: 'Manogna Sreenivas' },
      { '@type': 'Person', name: 'Rohit Kumar', '@id': PERSON_ID },
      { '@type': 'Person', name: 'Soma Biswas' },
    ],
    datePublished: '2026',
    publisher: { '@type': 'Organization', name: 'IEEE/CVF' },
    isPartOf: {
      '@type': 'PublicationEvent',
      name: 'CVPR 2026 Workshop on Generative AI for Storytelling (AISTORY)',
    },
    url: 'https://manogna-s.github.io/attristory/',
    sameAs: 'https://arxiv.org/abs/2605.20777',
    about: [
      'Visual Storytelling',
      'Diffusion Models',
      'Fine-Grained Attributes',
      'Generative AI',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Publications',
        item: `${site.origin}/#publications`,
      },
      { '@type': 'ListItem', position: 3, name: 'Projects', item: `${site.origin}/#projects` },
      { '@type': 'ListItem', position: 4, name: 'Blog', item: site.blogUrl },
    ],
  },
];

export const tacleStructuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline:
      'TACLE: Task and Class-aware Exemplar-free Semi-supervised Class Incremental Learning',
    author: [
      { '@type': 'Person', name: 'Jayateja Kalla' },
      { '@type': 'Person', name: 'Rohit Kumar', url: `${site.origin}/` },
      { '@type': 'Person', name: 'Soma Biswas' },
    ],
    datePublished: '2025',
    publisher: { '@type': 'Organization', name: 'IEEE/CVF' },
    isPartOf: { '@type': 'PublicationEvent', name: 'WACV 2025' },
    url: `${site.origin}/tacle/`,
    sameAs: 'https://arxiv.org/abs/2407.08041',
    description:
      'We propose TACLE, a novel framework for exemplar-free semi-supervised class incremental learning using task-adaptive thresholds and class-aware weighted cross-entropy loss.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Rohit Kumar', item: `${site.origin}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'TACLE - WACV 2025',
        item: `${site.origin}/tacle/`,
      },
    ],
  },
];
