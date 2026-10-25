import { Icon } from '../Icon';
import { ExternalLink } from '../ExternalLink';
import { achievements, education } from '../../data/education';

export function Education() {
  return (
    <div id="education" className="background-education">
      <h3 className="subsection-title">Education</h3>
      <ol className="education-list">
        {education.map((entry) => {
          const [period, result] = entry.details.split(' · ');
          return (
            <li className="education-record" key={entry.degree}>
              <div className="education-main">
                <h4>{entry.degree}</h4>
                <p>{entry.school}</p>
                {entry.courses && (
                  <details className="education-coursework">
                    <summary>Coursework <Icon name="chevronDown" size={14} /></summary>
                    <p>{entry.courses}</p>
                  </details>
                )}
              </div>
              <div className="education-meta"><p>{period}</p><p>{result}</p></div>
            </li>
          );
        })}
      </ol>
      <details className="background-achievements">
        <summary>Achievements & certifications <Icon name="chevronDown" /></summary>
        <ul className="achievement-list">
          {achievements.map((item) => (
            <li key={`${item.title}-${item.value}`}>
              <Icon name={item.icon} size={16} />
              <div><p><strong>{item.value}</strong><span> · {item.title}</span></p><p className="achievement-note">{item.subtitle}</p></div>
              {item.link && <ExternalLink href={item.link.href} className="profile-link" aria-label={item.link.ariaLabel}><span>Certificate</span><Icon name="arrowUpRight" size={14} /></ExternalLink>}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
