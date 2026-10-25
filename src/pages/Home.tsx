import { useEffect, useRef, type ReactNode, type MouseEvent } from 'react';
import { Icon } from '../components/Icon';
import { CopyEmail } from '../components/CopyEmail';
import { usePageScroll } from '../hooks/usePageScroll';
import { site, sections, socialUrls, type SectionId } from '../data/site';
import { publications, paperName, publicationDisplayAuthors } from '../data/publications';
import { experience, currentRole } from '../data/experience';
import { professionalFocus } from '../data/positioning';
import { education, achievements } from '../data/education';
import { featuredProjects, additionalProjects } from '../data/projects';
import { caseStudyFor } from '../data/caseStudies';
import { skills } from '../data/skills';

function Chapter({ id, note, children }: { id: SectionId; note?: string; children: ReactNode }) {
  return <section id={id} className="chapter" tabIndex={-1} aria-labelledby={`${id}-heading`}><div className="chapter-heading"><h2 id={`${id}-heading`}>{sections.find(s => s.id === id)!.title}</h2>{note && <p>{note}</p>}</div><div className="chapter-body">{children}</div></section>;
}

export function Home({ buildYear }: { buildYear: number }) {
  const { active } = usePageScroll();
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeMenu = () => { if (menu.current) menu.current.open = false; };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.current?.open) {
        closeMenu();
        menu.current.querySelector('summary')?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (menu.current?.open && event.target instanceof Node && !menu.current.contains(event.target)) closeMenu();
    };
    const root = document.querySelector('.portfolio-page');
    const observer = new ResizeObserver(entries => {
      if (entries[0] && entries[0].contentRect.width > 50 * parseFloat(getComputedStyle(document.documentElement).fontSize)) closeMenu();
    });
    if (root) observer.observe(root);
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', escape);
      document.removeEventListener('pointerdown', outside);
    };
  }, []);
  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (menu.current) menu.current.open = false;
    requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }));
  };
  const links = () => sections.map(section => (
    <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined} onClick={event => navigate(event, section.id)}>
      {section.nav}
    </a>
  ));
  return <div className="portfolio-page">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="page-grid">
      <aside className="page-index"><a href="#home" className="index-identity" onClick={event => navigate(event, 'home')}>{site.name}</a><nav className="page-links" aria-label="Page sections">{links()}</nav><details ref={menu} className="compact-menu"><summary>Menu <Icon name="chevronDown" /></summary><nav aria-label="Mobile sections">{links()}</nav></details></aside>
      <main id="main-content" tabIndex={-1}>
        <section id="home" className="opening" tabIndex={-1} aria-label="Introduction">
          <div className="opening-copy"><p className="eyebrow">{currentRole.title} at {currentRole.company}</p><h1>{site.name}</h1><p className="opening-lead">{professionalFocus}</p><p className="opening-detail">Previously at Avataar AI, I worked on product-image generation and novel-view synthesis. M.Tech in AI, IISc Bangalore. My research explores visual storytelling and learning from limited data.</p><div className="opening-links"><div className="opening-actions"><a className="email-action" href={`mailto:${site.email}`}><Icon name="mail" />Email me</a><a href="/resume/">Résumé</a></div><nav className="opening-profiles" aria-label="Professional profiles"><a href={socialUrls.scholar}>Scholar</a><a href={socialUrls.github} rel="me">GitHub</a><a href={socialUrls.linkedin} rel="me">LinkedIn</a></nav></div></div>
          <img className="portrait" src="/assets/images/profile.webp" alt="Rohit Kumar" width={112} height={134} decoding="async" />
        </section>
        <Chapter id="research" note="Selected publications"><span id="publications" />
          {publications.map(pub => <article className="paper-record" key={pub.title}><div><p className="record-context">{pub.venueShort}</p><h3>{paperName(pub)}</h3><p>{pub.title.split(':').slice(1).join(':').trim()}</p><p className="record-authors">{publicationDisplayAuthors(pub).map((author,i) => <span key={author.name}>{i > 0 && ', '}{author.self ? <strong>{author.name}</strong> : author.name}{author.suffix}</span>)}</p><div className="resource-links">{pub.links.filter(l => ['Paper','Code','Website'].includes(l.label)).map(link => <a key={link.href} href={link.href} aria-label={link.ariaLabel}><Icon name={link.icon} size={15} />{link.label === 'Website' ? 'Project page' : link.label}</a>)}</div><details className="research-notes"><summary aria-label={`${paperName(pub)} research summary and additional resources`}>Research summary <Icon name="chevronDown" size={14} /></summary><p>{pub.summary}</p><div className="resource-links">{pub.links.filter(l => !['Paper','Code','Website'].includes(l.label)).map(link => <a key={link.href} href={link.href} aria-label={link.ariaLabel}>{link.label}</a>)}</div></details></div></article>)}
          <p className="equal-credit">* Equal contribution.</p>
          <p className="section-note" id="service">Invited reviewer · NeurIPS, CVPR & ECCV 2026.</p>
        </Chapter>
        <Chapter id="projects" note="Selected engineering">
          {featuredProjects.map(project => { const study = caseStudyFor(project.id)!; return <article className="work-record" key={project.id}><div className="record-top"><h3>{study.title}</h3><span>{study.organization}</span></div><p>{study.summary}</p><p className="contribution">{study.contribution}</p><div className="resource-links"><a href={`/work/${project.id}/`} aria-label={`Read ${study.title} case study`}>Read case study</a>{project.links?.filter(l => l.title === 'Demo').map(link => <a key={link.href} href={link.href} aria-label={link.ariaLabel}><Icon name="play" size={15} />Try the demo</a>)}</div></article>; })}
          <p className="section-note"><a href="/work/">All engineering work</a></p><details><summary>More projects <Icon name="chevronDown" /></summary>{additionalProjects.map(project => <article className="work-record" key={project.id}><h3>{project.title}</h3><p>{project.description}</p><div className="resource-links">{project.links?.map(l => <a key={l.href} href={l.href}>{l.title}</a>)}</div></article>)}</details>
        </Chapter>
        <Chapter id="experience">{experience.map(job => <div className="career-record" id={`experience-${job.id}`} key={job.id}><div><h3>{job.title} · {job.company}</h3><p>{job.location}</p>{job.managers && <p className="manager-line">{job.managers.length === 1 ? 'Manager' : 'Managers'}: {job.managers.map((manager, index) => <span key={manager.href}>{index > 0 && ', '}<a href={manager.href}>{manager.name}</a></span>)}</p>}</div><span>{job.date}</span></div>)}<details id="skills"><summary>Tools & capabilities <Icon name="chevronDown" /></summary><dl className="skills-list">{skills.map(category => <div key={category.name}><dt>{category.name}</dt><dd>{category.items.join(' · ')}</dd></div>)}</dl></details></Chapter>
        <Chapter id="about"><p className="background-copy">I started in electrical engineering and chose AI research at IISc Bangalore. My M.Tech work explored learning new classes without retaining examples from earlier tasks, leading to TACLE at WACV 2025.</p><div id="education">{education.map(entry => <div className="career-record" key={entry.degree}><div><h3>{entry.degree}</h3><p>{entry.school}</p>{entry.advisor && <p className="manager-line">{entry.advisor.label ?? 'Advisor'}: <a href={entry.advisor.href}>{entry.advisor.name}</a></p>}</div><span>{entry.details.split(' · ')[0]}</span></div>)}</div><details><summary>Achievements & certifications <Icon name="chevronDown" /></summary><ul className="credentials">{achievements.map(item => <li key={item.title}>{item.value} · {item.title}{item.link && <> · <a href={item.link.href} aria-label={item.link.ariaLabel}>Certificate</a></>}</li>)}</ul></details></Chapter>
        <Chapter id="contact"><div className="contact-tools"><a href={`mailto:${site.email}`}>{site.email}</a><CopyEmail /></div></Chapter>
        <footer className="page-footer"><span>© {buildYear} {site.name}</span><a href={site.blogUrl}>Writing</a><a href={socialUrls.huggingface}>Hugging Face</a></footer>
      </main>
    </div>
  </div>;
}
