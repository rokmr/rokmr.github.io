import { caseStudies } from '../data/caseStudies';
import { projects } from '../data/projects';

const detailedIds = new Set(caseStudies.map(study => study.id));
// Research has its own chapter; other published projects remain discoverable.
const otherProjects = projects.filter(project => project.id !== 'tacle' && !detailedIds.has(project.id));

export function WorkIndex() {
  return (
    <div className="portfolio-page">
      <main className="document-page">
        <nav className="document-nav" aria-label="Page navigation"><a href="/#projects">Portfolio</a><a href="/resume/">Résumé</a></nav>
        <h1>Engineering work</h1>
        {[...new Set(caseStudies.map(study => study.organization))].map(organization => (
          <section className="document-block" key={organization}>
            <h2>{organization === 'Independent project' ? 'Independent work' : organization}</h2>
            {caseStudies.filter(study => study.organization === organization).map(study => (
              <article className="work-record" key={study.id}>
                <h3><a href={`/work/${study.id}/`}>{study.title}</a></h3>
                <p>{study.summary}</p>
                <p className="contribution">{study.contribution}</p>{study.evidence && <p className="work-evidence">{study.evidence}</p>}
              </article>
            ))}
          </section>
        ))}
        {otherProjects.length > 0 && <section className="document-block">
          <h2>Additional projects</h2>
          {otherProjects.map(project => <article className="work-record" key={project.id}>
            <h3>{project.title}</h3><p>{project.description}</p>
            <div className="resource-links">{project.links?.map(link => <a key={link.href} href={link.href.startsWith('assets/') ? '/' + link.href : link.href} aria-label={link.ariaLabel}>{link.title}</a>)}</div>
          </article>)}
        </section>}
      </main>
    </div>
  );
}
