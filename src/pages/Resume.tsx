import { site, socialUrls } from '../data/site';
import { experience } from '../data/experience';
import { education, achievements } from '../data/education';
import { publications } from '../data/publications';
import { resumeSkills, resumeHeadline, resumeSummary, resumeProjects, resumePublicationAuthors } from '../data/resume';

const publicHref = (href: string) => href.startsWith('assets/') ? '/' + href : href;

/** Printable public résumé; reads the same records as the portfolio. */
export function Resume() {
  return (
    <div className="portfolio-page">
      <main className="document-page resume-page">
        <nav className="document-nav" aria-label="Résumé actions">
          <a href="/">Portfolio</a>
          <a href="/assets/Rohit-Kumar-Resume.pdf" download>Download PDF</a>
          <button type="button" onClick={() => window.print()}>Print</button>
        </nav>
        <h1>{site.name}</h1>
        <p className="document-intro">{resumeHeadline}</p>
        <p><a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.origin}>rohit.vision</a> · <a href={socialUrls.github}>GitHub</a> · <a href={socialUrls.linkedin}>LinkedIn</a></p>
        <section className="document-block">
          <h2>Summary</h2>
          <p>{resumeSummary}</p>
        </section>
        <section className="document-block">
          <h2>Skills</h2>
          {resumeSkills.map(group => <p key={group.name}><strong>{group.name}:</strong> {group.items.join(', ')}</p>)}
        </section>
        <section className="document-block">
          <h2>Publications</h2>
          {publications.map(pub => (
            <article className="resume-job resume-publication" key={pub.title}>
              <h3>{pub.title}</h3>
              <p>{resumePublicationAuthors(pub).map((author, index) => <span key={author.name}>{index > 0 && ', '}{author.self ? <strong>{author.name}</strong> : author.name}{author.suffix}</span>)} · {pub.venueShort}</p>
              <div className="publication-resources">{pub.links.filter(link => ['Paper','Code','Website'].includes(link.label)).map(link => <a key={link.href} href={publicHref(link.href)} aria-label={link.ariaLabel}>{link.label === 'Website' ? 'Project page' : link.label}</a>)}</div>
            </article>
          ))}
          <p className="publication-credit">* Equal contribution.</p>
          <p>Invited reviewer: NeurIPS, CVPR & ECCV 2026.</p>
        </section>
        <section className="document-block">
          <h2>Experience</h2>
          {experience.map(job => (
            <article className={`resume-job${job.id === 'avataar' ? ' resume-experience-continuation' : ''}`} key={job.id}>
              <div className="record-top"><h3>{job.title} · {job.companyUrl ? <a href={job.companyUrl}>{job.company}</a> : job.company}</h3><span>{job.date}</span></div>
              <p>{job.location}</p>
              {job.managers && <p className="manager-line">{job.managers.length === 1 ? 'Manager' : 'Managers'}: {job.managers.map((manager, index) => <span key={manager.href}>{index > 0 && ', '}<a href={manager.href}>{manager.name}</a></span>)}</p>}
              <ul>{(job.resumeBulletIndexes ?? job.bullets.map((_, index) => index)).map(index => job.bullets[index]).filter((bullet): bullet is string => Boolean(bullet)).map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
              {job.id === 'armada' && <p><a href="/work/agentic-rag/">[Support Agent]</a> <a href="/work/almanac/">[Almanac]</a></p>}
            </article>
          ))}
        </section>
        <section className="document-block">
          <h2>Projects</h2>
          {resumeProjects.map(project => <article className="resume-job" key={project.href}><h3 className="resume-project-heading"><span>{project.title}</span><a href={project.href}>Case study</a></h3><p>{project.summary}</p></article>)}
        </section>
        <section className="document-block">
          <h2>Education</h2>
          {education.map(entry => {
            const [period, result] = entry.details.split(' · ');
            return <div className="resume-job" key={entry.degree}><div className="record-top"><h3>{entry.degree}</h3><span>{period}</span></div><p>{entry.school} · {result}</p>{entry.advisor && <p className="manager-line">{entry.advisor.label ?? 'Advisor'}: <a href={entry.advisor.href}>{entry.advisor.name}</a></p>}</div>;
          })}
        </section>
        <section className="document-block">
          <h2>Achievements</h2>
          <p>{achievements.slice(0,3).map(item => `${item.value} · ${item.title}`).join('; ')}.</p>
        </section>
      </main>
    </div>
  );
}
