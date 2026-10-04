import { SectionHeader } from '../SectionHeader';
import { Icon } from '../Icon';
import { ExternalLink } from '../ExternalLink';
import { achievements, education } from '../../data/education';

export function Education() {
  return (
    <section id="education" aria-label="Education and Achievements">
      <SectionHeader number="06" title="Education" />
      <div className="education-grid">
        {education.map((entry) => (
          <div className="education-card" key={entry.degree}>
            <h3 className="edu-degree">{entry.degree}</h3>
            <p className="edu-school">{entry.school}</p>
            <p className="edu-details">{entry.details}</p>
            {entry.courses && <p className="edu-courses">{entry.courses}</p>}
          </div>
        ))}
      </div>

      <h3 className="edu-subsection-title">Achievements &amp; Certifications</h3>
      <div className="achievements-grid">
        {achievements.map((item) => (
          <div className="achievement-card" key={`${item.title}-${item.value}`}>
            <div className="achievement-icon">
              <Icon name={item.icon} size={24} />
            </div>
            <div className="achievement-value">{item.value}</div>
            <div className="achievement-title">{item.title}</div>
            <div className="achievement-subtitle">{item.subtitle}</div>
            {item.link && (
              <ExternalLink
                href={item.link.href}
                className="achievement-link"
                aria-label={item.link.ariaLabel}
              >
                <Icon name="externalLink" size={12} /> View Certificate
              </ExternalLink>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
