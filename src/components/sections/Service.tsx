import { SectionHeader } from '../SectionHeader';
import { ExternalLink } from '../ExternalLink';
import { service } from '../../data/service';

export function Service() {
  return (
    <section id="service" className="service-section" aria-label="Academic Service and Reviewing">
      <SectionHeader number="07" title="Academic Service" />
      <div className="service-list">
        {service.map((entry) => (
          <div className="service-item" key={entry.venue}>
            <span className="service-role">{entry.role}</span>
            <span className="service-separator">—</span>
            <ExternalLink href={entry.venueUrl} className="service-venue">
              {entry.venue}
            </ExternalLink>
            <span className="service-desc">{entry.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
