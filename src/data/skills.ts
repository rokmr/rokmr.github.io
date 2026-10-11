export type SkillCategory = { name: string; items: string[] };

export const skills: SkillCategory[] = [
  {
    name: 'AI/ML',
    items: [
      'LLMs',
      'RAG',
      'CRAG',
      'Agentic AI',
      'Computer Vision',
      'Diffusion Models',
      'NLP',
      'Hybrid Search',
      'BM25',
      'Evals (RAGAS)',
    ],
  },
  {
    name: 'Frameworks & Tools',
    items: [
      'Python',
      'PyTorch',
      'LangGraph',
      'LangChain',
      'HuggingFace',
      'FastAPI',
      'Chainlit',
      'Playwright',
      'Docling',
    ],
  },
  {
    name: 'Infrastructure',
    items: ['Docker', 'Helm', 'AWS', 'PostgreSQL', 'Qdrant', 'Langfuse', 'SSO/RBAC'],
  },
];
