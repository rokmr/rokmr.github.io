/** Public case studies. Add records here; homepage selection stays separately curated. */
export type CaseStudy = {
  id: string;
  title: string;
  organization: string;
  summary: string;
  contribution: string;
  technologies?: string[];
  sections: { heading: string; paragraphs: string[] }[];
};
export const caseStudies: CaseStudy[] = [
  {
    id: 'agentic-rag', title: 'Support RAG Agent', organization: 'Armada AI',
    summary: 'A grounded question-answering system for Armada’s internal Customer Support team, searching runbooks, help-center content and vendor documentation.',
    contribution: 'Sole owner, from initial support-team interviews and an empty repository through production integration.',
    sections: [
      { heading: 'Understanding the workflow', paragraphs: ['Met the internal Customer Support team before writing code and again after launch to understand how they searched documentation and used answers in their work.'] },
      { heading: 'Problem', paragraphs: ['Customer Support searched manually across internal runbooks, help-center content and vendor documentation. The system needed to retrieve relevant evidence, understand organizational vocabulary and produce answers grounded in those sources.'] },
      { heading: 'My contribution', paragraphs: ['Designed a CRAG and controllable ReAct workflow in LangGraph, with retrieval evaluation before answer generation. Shared query reformulation and embedding generation across branches to remove redundant calls.', 'Built a custom BM25 index with incremental updates and removal. Combined sparse and dense retrieval over Qdrant to address organizational vocabulary that dense retrieval missed.'] },
      { heading: 'Evaluation', paragraphs: ['Built two levels of evaluation: retrieval-confidence and CRAG-score gating within the agent, and RAGAS-based response evaluation against curated ground truth. These assess different failure points: finding relevant evidence and producing a grounded answer.'] },
      { heading: 'Document processing', paragraphs: ['Replaced separate ingestion paths with a normalized Markdown intermediate representation. File formats converge on that representation before chunking and indexing.', 'Replaced single-pass image captioning with classification followed by type-conditioned captioning for document images, including flowcharts and screenshots.'] },
      { heading: 'Outcome', paragraphs: ['Reduced cost per query/run to approximately one-third of the initial graph, comparing similar workloads.', 'The shared graph node removes repeated reformulation and embedding work. Incremental sparse indexing and the common ingestion representation make knowledge-base changes easier to maintain.'] },
    ],
  },

  {
    id: 'almanac', title: 'Almanac: air-gapped document Q&A', organization: 'Armada AI',
    summary: 'An on-device RAG application designed for document question answering on Armada edge hardware without internet access.',
    contribution: 'Sole engineering owner. Product management owns the product requirements.',
    technologies: ['SFT', 'LoRA', 'QLoRA', 'Ray', 'Local model serving', 'Document processing', 'Hybrid retrieval', 'RBAC'],
    sections: [
      { heading: 'Purpose', paragraphs: ['Built as a proof of capability and sales-enablement application for edge hardware, with a default documentation corpus and support for a prospect’s own documents. Answers cite their sources, and low-confidence retrieval is handled explicitly.'] },
      { heading: 'Engineering', paragraphs: ['Developed local model serving, document ingestion, retrieval, reranking and cited-answer generation. The document pipeline covers parsing, layout, OCR, tables, figures, chunking and embeddings.', 'Moved model serving from vLLM to Ray to run multiple model types concurrently, with per-model resource control and on-demand loading and unloading. Integrated access control with existing edge roles.'] },
      { heading: 'Model adaptation', paragraphs: ['Fine-tuned models for Almanac using supervised fine-tuning (SFT), LoRA and QLoRA.'] },
      { heading: 'Current status', paragraphs: ['Document ingestion, question answering, evaluation tooling and inference planning work in an isolated VM. A fresh installation with the internet disconnected has not yet been tested. Retrieval and generated-answer quality evaluation is underway; completed answer-quality results are not yet reported.'] },
    ],
  },
  {
    id: 'inference-planner', title: 'LLM Inference Planning & Optimization', organization: 'Armada AI',
    summary: 'LLM inference planning, deployment and optimization, supported by predictions of memory, latency, throughput and cost.',
    contribution: 'Built capacity, performance and cost modeling that grew out of Almanac into a more independent planning tool; carried out inference deployment after selecting hardware and serving configurations.',
    technologies: ['KV-cache modeling', 'LLM inference', 'Quantization', 'Tensor parallelism', 'Automatic prefix caching'],
    sections: [
      { heading: 'Decisions', paragraphs: ['Compares GPU and configuration choices for a selected model and workload: weight quantization, KV-cache quantization, tensor parallelism, eager execution and automatic prefix caching. Quantization work includes AWQ, GPTQ and weight/activation precision configurations (WxAy). The planner recommends settings; I carry out deployment afterward. It does not automatically deploy workloads.'] },
      { heading: 'Predictions', paragraphs: ['Models KV-cache requirements, time to first token (TTFT), time per output token (TPOT) and token throughput before downloading a model or running a trial GPU deployment. Covers dense, mixture-of-experts and hybrid model families, including mixed attention patterns and attention/state-space architectures.'] },
      { heading: 'Deployment', paragraphs: ['After planning, I deploy inference workloads using the selected hardware and serving configurations. This extends my work from predicting resource needs and comparing configurations to deploying the planned workloads.'] },
      { heading: 'Estimated economics', paragraphs: ['Estimates prefill and decode costs per million tokens from the user-supplied hourly GPU cost and predicted throughput. These are planning estimates, distinct from measured serving costs.'] },
    ],
  },
  {
    id: 'ai-assistant', title: 'AI Assistant retrieval improvements', organization: 'Armada AI',
    summary: 'Contributions to an inherited RAG application, distinct from the Support Agent I later owned.',
    contribution: 'Contributor. Redesigned the LangGraph workflow and improved context preparation, retrieval and metadata handling.',
    technologies: ['LangGraph', 'Qdrant', 'Hybrid retrieval', 'Query decomposition'],
    sections: [
      { heading: 'Problem', paragraphs: ['The inherited pipeline had grounding failures, duplicate retrieval results, inconsistent metadata, oversized context and chunking defects.'] },
      { heading: 'My contribution', paragraphs: ['Restructured the LangGraph workflow and context preparation, corrected a source-metadata mapping bug, and added query decomposition for multi-intent questions.', 'Proposed and implemented dense-plus-sparse retrieval, optimized batch ingestion into Qdrant and consolidated separate retrieval indexes.'] },
      { heading: 'Delivery boundary', paragraphs: ['The workflow changes were adopted and deployed. Embedding-service work was completed but not deployed.'] },
    ],
  },

  {
    id: 'lifestyle-generation', title: 'Diffusion-based product imagery', organization: 'Avataar AI',
    summary: 'A lifestyle-image generation pipeline that preserves the product while adapting its appearance to a new scene.',
    contribution: 'Built the Flux and ControlNet pipeline and modified sampling for product reconstruction and relighting.',
    sections: [
      { heading: 'Problem', paragraphs: ['Generated lifestyle imagery needs to preserve the product itself. A plausible scene is insufficient if the object changes or its lighting is inconsistent with its surroundings.'] },
      { heading: 'My contribution', paragraphs: ['Built an end-to-end image-generation pipeline using Flux and ControlNets. Modified diffusion sampling to improve object reconstruction, followed by intrinsic decomposition for product relighting.', 'Worked on segmentation with BiRefNet and SAM with YOLO-world, and on classification in low-data settings using CLIP, BLIP2 and Qwen2.5.'] },
      { heading: 'Novel-view synthesis', paragraphs: ['Continued an existing sparse-view-conditioned diffusion project during roughly the first two months at Avataar AI. A senior engineer had established the initial setup.', 'Fine-tuned a Stable Diffusion model in a Zero123-like setting for novel-view synthesis, worked on image-conditioning changes, and handled distributed training and SLURM job submission on an HPC cluster. Used the full 32-H100 training cluster for a few days.'] },
      { heading: 'Outcome', paragraphs: ['Delivered a product-image generation pipeline with improved reconstruction and relighting.'] },
    ],
  },
  {
    id: 'cricket-shot', title: 'Cricket-Shot Predictor', organization: 'Independent project',
    summary: 'Video classification for cricket shots, from frame extraction to a runnable prediction demo.',
    contribution: 'Built embedding-based video classifiers and fine-tuned VideoMAE.',
    sections: [
      { heading: 'Approach', paragraphs: ['Built a video-processing pipeline covering frame extraction, embeddings, labeling, experiment logging and model sharing on Hugging Face.', 'Explored CLIP and SigLIP embeddings with LSTM classifiers, then fine-tuned VideoMAE.'] },
      { heading: 'Results and interpretation', paragraphs: ['Recorded test accuracy: CLIP–LSTM 52%, SigLIP–LSTM 53%, and fine-tuned VideoMAE 66.05%. Dataset and split documentation is pending, so these results should not be treated as a controlled model comparison.'] },
      { heading: 'Try it', paragraphs: ['The demo and source repository are linked below. They provide a direct way to inspect the implementation and its predictions.'] },
    ],
  },
  {
    id: 'model-evaluation', title: 'Document-model evaluation pipeline', organization: 'Evaluation tooling',
    summary: 'A pipeline for comparing and substituting document-processing and retrieval models to select suitable components.',
    contribution: 'Evaluated table-structure models, OCR models, layout detectors and embedding models, and built a pipeline that supports switching between candidates.',
    technologies: ['Table structure recognition', 'OCR', 'Layout detection', 'Embedding models', 'Model evaluation'],
    sections: [
      { heading: 'Scope', paragraphs: ['Compared models for table structure, text recognition, page layout and embeddings. Built interchangeable pipeline components so model selection is driven by suitability for the task.'] },
    ],
  },

];
export function caseStudyFor(id: string) { return caseStudies.find(study => study.id === id); }
