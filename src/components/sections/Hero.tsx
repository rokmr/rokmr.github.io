import type { MouseEventHandler } from 'react';
import { Icon } from '../Icon';
import { heroStats, site, socialUrls } from '../../data/site';

export function Hero({ onNavClick }: { onNavClick: MouseEventHandler }) {
  return (
    <section className="hero" id="home">
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-eyebrow">{site.role}</div>
          <h1>Bridging Computer Vision &amp; LLMs in Production</h1>
          <p className="hero-story">
            I've trained CNNs to see and transformers to reason. Now I build systems where both work
            together - from <strong>diffusion pipelines</strong> shipping photorealistic product
            imagery at Avataar AI, to <strong>agentic AI pipelines</strong> at Armada AI, owning
            retrieval, evals, and observability end-to-end. <strong>IISc Bangalore</strong> alumnus,{' '}
            <strong>GATE AIR 221 (EE) &amp; 227 (IN)</strong>.
          </p>
          <div className="hero-stats">
            {heroStats.map((stat) => (
              <a key={stat.label} href={stat.href} className="stat" onClick={onNavClick}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </a>
            ))}
          </div>
          <div className="hero-actions">
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              <Icon name="mail" round={false} />
              Get in Touch
            </a>
            <a
              href={socialUrls.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <Icon name="github" round={false} />
              GitHub
            </a>
            <a
              href={socialUrls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <Icon name="linkedin" round={false} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
