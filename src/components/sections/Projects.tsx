import { SectionHeader } from '../SectionHeader';
import { Icon } from '../Icon';
import { Picture } from '../Picture';
import { ExternalLink } from '../ExternalLink';
import { projects } from '../../data/projects';

export function Projects() {
  return (
    <section id="projects" aria-label="AI and ML Projects">
      <SectionHeader id="projects" />
      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <div className="project-preview">
              <Picture preview={project.preview} />
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
              <div className="project-tech">
                {project.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
