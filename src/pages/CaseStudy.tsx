import { TechnicalDiagram } from '../components/TechnicalDiagram';
import { technicalDiagrams } from '../data/diagrams';
import { caseStudyFor } from '../data/caseStudies';
import { projects } from '../data/projects';
import { site } from '../data/site';
import { Icon } from '../components/Icon';

export function CaseStudy({ id }: { id: string }) {
  const study = caseStudyFor(id)!;
  const project = projects.find(item => item.id === id);
  return <div className="portfolio-page"><main className="document-page"><nav className="document-nav" aria-label="Page navigation"><a href="/work/">All work</a><a href="/resume/">Résumé</a></nav><p className="eyebrow">{study.organization}</p><h1>{study.title}</h1><p className="document-intro">{study.summary}</p><p className="opening-detail">{study.contribution}</p>{study.sections.map(section => <section className="document-block" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}{technicalDiagrams.filter(diagram => diagram.caseStudyId === id && diagram.afterSection === section.heading).map(diagram => <TechnicalDiagram key={diagram.id} diagram={diagram} />)}</section>)}<div className="resource-links">{project?.links?.map(link => <a href={link.href.startsWith('assets/') ? '/'+link.href : link.href} key={link.href} aria-label={link.ariaLabel}><Icon name={link.icon} size={15} />{link.title}</a>)}</div>{(study.technologies ?? project?.tech)?.length ? <section className="document-block"><h2>Tools</h2><p>{(study.technologies ?? project?.tech)?.join(' · ')}</p></section> : null}<footer className="page-footer"><a href="/#projects">Back to selected work</a><a href={`mailto:${site.email}`}>{site.email}</a>{technicalDiagrams.some(diagram => diagram.caseStudyId === id) && <span className="diagram-icon-credit"><a href="https://streamlinehq.com">Streamline icons</a> · <a href="https://creativecommons.org/licenses/by/4.0/" aria-label="Streamline icons licensed under Creative Commons Attribution 4.0">CC BY 4.0</a></span>}</footer></main></div>;
}
