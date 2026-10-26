export type SkillCategory = { name: string; items: string[] };

export const skills: SkillCategory[] = [
  { name: 'Languages', items: ['Python', 'SQL', 'MATLAB'] },
  {
    name: 'AI/ML',
    items: [
      'LLMs',
      'RAG',
      'CRAG',
      'Agentic AI',
      'Computer Vision',
      'Novel-view Synthesis',
      'Diffusion Models',
      'NLP',
      'Supervised fine-tuning (SFT)',
      'LoRA',
      'QLoRA',
      'Hybrid Search',
      'BM25',
      'Evals (RAGAS)',
      'Document-model evaluation',
      'AWQ',
      'GPTQ',
      'Weight/activation quantization (WxAy)',
    ],
  },
  {
    name: 'Frameworks & Tools',
    items: [
      'ONNX',
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
    items: ['Kubernetes', 'Ray', 'vLLM', 'Keycloak', 'Distributed training', 'SLURM', 'Docker', 'Helm', 'AWS', 'PostgreSQL', 'Qdrant', 'Langfuse', 'SSO/RBAC'],
  },
];
