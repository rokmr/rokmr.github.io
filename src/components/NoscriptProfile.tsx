import { site, socialUrls } from '../data/site';

/**
 * Semantic fallback for crawlers and agents that do not execute JS. The page is
 * prerendered so this is belt-and-braces, but it also carries the microdata.
 */
export function NoscriptProfile() {
  return (
    <noscript>
      <article itemScope itemType="https://schema.org/Person">
        <h1 itemProp="name">Rohit Kumar</h1>
        <p itemProp="jobTitle">AI Engineer | Research Engineer | Machine Learning Engineer</p>
        <p itemProp="description">
          AI Engineer and Research Engineer specializing in Computer Vision, Large Language Models
          (LLMs), Agentic AI systems, and Diffusion Models. Currently building production ML systems
          at Armada AI. IISc Bangalore M.Tech alumnus with GATE AIR 221. Published at WACV 2025 and
          CVPR 2026 Workshop (AISTORY). Invited reviewer for NeurIPS 2026, CVPR 2026, and ECCV 2026.
          Expertise in: PyTorch, LangGraph, RAG pipelines, Diffusion Models, CLIP, SAM, YOLO.
        </p>
        <p>
          Education: <span itemProp="alumniOf">Indian Institute of Science (IISc) Bangalore</span> -
          M.Tech in AI (2022-2024)
        </p>
        <p>
          Skills: Computer Vision, LLMs, Agentic AI, Diffusion Models, RAG, Deep Learning, NLP,
          PyTorch, LangGraph, FastAPI
        </p>
        <p>
          Contact:{' '}
          <a itemProp="email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </p>
        <p>
          Links: <a itemProp="url" href={socialUrls.github}>GitHub</a> |{' '}
          <a itemProp="sameAs" href={socialUrls.linkedin}>LinkedIn</a> |{' '}
          <a itemProp="sameAs" href={socialUrls.scholar}>Google Scholar</a> |{' '}
          <a href={site.blogUrl}>Blog</a>
        </p>
      </article>
    </noscript>
  );
}
