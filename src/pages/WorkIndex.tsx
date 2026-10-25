import { caseStudies } from '../data/caseStudies';

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
                <p className="contribution">{study.contribution}</p>
              </article>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
