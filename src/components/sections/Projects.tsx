import { SectionHeader } from '../SectionHeader';
import { Icon } from '../Icon';
import { Picture } from '../Picture';
import { ExternalLink } from '../ExternalLink';
import { featuredProjects, additionalProjects } from '../../data/projects';

export function Projects() {
  return (
    <section id="projects" aria-label="Selected work">
      <SectionHeader id="projects" />
      <p className="work-introduction">Production systems, generative vision, and an independent project you can try.</p>
      <div className="selected-work-list">
        {featuredProjects.map((project) => (
          <article className="selected-work-entry" id={`work-${project.id}`} key={project.id}>
            <div className="work-visual">
              <Picture preview={project.preview} />
            </div>
            <div className="work-story">
              <p className="work-context">{project.badge ?? 'Independent project'}</p>
              <h3>{project.title}</h3>
              <dl className="work-facts">
                <div><dt>Problem</dt><dd>{project.problem}</dd></div>
                <div><dt>My work</dt><dd>{project.contribution}</dd></div>
                <div><dt>Outcome</dt><dd>{project.outcome}</dd></div>
              </dl>
              <div className="work-resources">
                {project.roleId && <a href={`#experience-${project.roleId}`} className="profile-link"><Icon name="arrowDown" /><span>Role & responsibilities</span></a>}
                {project.links?.map((link) => (
                  <ExternalLink key={link.href} href={link.href} className="profile-link" aria-label={link.ariaLabel}>
                    <Icon name={link.icon} /><span>{link.title}</span>
                  </ExternalLink>
                ))}
              </div>
              <p className="work-tools"><span>Tools</span> {project.tech.join(' · ')}</p>
            </div>
          </article>
        ))}
      </div>
      {additionalProjects.length > 0 && (
        <details className="more-work">
          <summary>More projects <Icon name="chevronDown" /></summary>
          {additionalProjects.map((project) => (
            <article className="additional-work" key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="work-resources">
                {project.links?.map((link) => <ExternalLink key={link.href} href={link.href} className="profile-link" aria-label={link.ariaLabel}><Icon name={link.icon} /><span>{link.title}</span></ExternalLink>)}
              </div>
            </article>
          ))}
        </details>
      )}
    </section>
  );
}
