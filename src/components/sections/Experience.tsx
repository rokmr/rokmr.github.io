import { SectionHeader } from '../SectionHeader';
import { experience } from '../../data/experience';

export function Experience() {
  return (
    <section id="experience" aria-label="Work Experience">
      <SectionHeader id="experience" />
      <div className="timeline">
        {experience.map((job) => (
          <div
            key={`${job.company}-${job.title}-${job.date}`}
            className={`timeline-item${job.current ? ' current' : ''}`}
          >
            <div className="exp-header">
              <div>
                <h3 className="exp-title">{job.title}</h3>
                <div className="exp-company">{job.company}</div>
              </div>
              <div className="exp-date">
                {job.date}
                <div className="exp-location">{job.location}</div>
              </div>
            </div>
            <ul className="exp-description">
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div className="exp-tech">
              {job.tech.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
