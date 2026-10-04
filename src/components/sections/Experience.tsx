import { SectionHeader } from '../SectionHeader';
import { experience } from '../../data/experience';

/**
 * Work history on the page grid: what was done in the main column, when,
 * where and with what in the margin column — the same column that carries
 * the hero byline and the abstract's sidenotes. The timeline rail sits in the
 * page gutter so the text keeps the page's left edge.
 */
export function Experience() {
  return (
    <section id="experience" aria-label="Work Experience">
      <SectionHeader id="experience" />
      <ol className="timeline">
        {experience.map((job) => (
          <li
            key={`${job.company}-${job.title}-${job.date}`}
            className={`timeline-item l-margin${job.current ? ' current' : ''}`}
          >
            <div>
              <h3 className="exp-title">{job.title}</h3>
              <p className="exp-company">{job.company}</p>
              <ul className="exp-points">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
            <dl className="meta">
              <div className="meta__row">
                <dt className="meta__label">When</dt>
                <dd className="meta__value">{job.date}</dd>
              </div>
              <div className="meta__row">
                <dt className="meta__label">Where</dt>
                <dd className="meta__value">{job.location}</dd>
              </div>
              <div className="meta__row">
                <dt className="meta__label">Stack</dt>
                <dd className="meta__value tag-row">
                  {job.tech.map((tech) => (
                    <span className="tag" key={tech}>
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
