import { SectionHeader } from '../SectionHeader';
import { Icon } from '../Icon';
import { Picture } from '../Picture';
import { ExternalLink } from '../ExternalLink';
import { projects } from '../../data/projects';
import { useNoiseReveal } from '../../hooks/useNoiseReveal';

export function Projects() {
  useNoiseReveal();
  return (
    <section id="projects" aria-label="AI and ML Projects">
      <SectionHeader id="projects" />
      <div className="card-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <div className="project-preview" data-noise-reveal="">
              <Picture preview={project.preview} />
              <span className="noise-reveal__layer" aria-hidden="true" />
            </div>
            <div className="project-content">
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <div className="project-links">
                  {project.badge && <span className="project-badge">{project.badge}</span>}
                  {project.links?.map((link) => (
                    <ExternalLink
                      key={link.href}
                      href={link.href}
                      title={link.title}
                      aria-label={link.ariaLabel}
                    >
                      <Icon name={link.icon} />
                    </ExternalLink>
                  ))}
                </div>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="tag-row">
                {project.tech.map((tech) => (
                  <span className="tag" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
