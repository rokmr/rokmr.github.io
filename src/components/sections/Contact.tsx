import { SectionHeader } from '../SectionHeader';
import { Icon } from '../Icon';
import { ExternalLink } from '../ExternalLink';
import { site, socialLinks } from '../../data/site';
import { currentRole } from '../../data/experience';

/**
 * Contact on the page grid: the invitation and every way to reach out (one
 * .pill-row, email first) in the main column; the address and location in
 * the margin column.
 */
export function Contact() {
  return (
    <section id="contact" aria-label="Contact Information">
      <SectionHeader id="contact" />
      <div className="contact l-margin">
        <div>
          <h2 className="contact-title">Let's Build Something Together</h2>
          <p className="contact-text">
            Looking for collaboration on AI/ML projects, research opportunities, or just want to
            chat about generative models and agentic systems.
          </p>
          <div className="pill-row contact-links">
            <a href={`mailto:${site.email}`} className="pill pill--primary">
              <Icon name="mail" size={14} />
              Email me
            </a>
            {socialLinks.map((link) => (
              <ExternalLink
                key={link.key}
                href={link.url}
                me={link.me}
                className="pill"
                aria-label={link.key === 'blog' ? 'Blog' : `${link.label} profile`}
              >
                <Icon name={link.icon} size={14} />
                {link.label}
              </ExternalLink>
            ))}
          </div>
        </div>
        <dl className="meta">
          <div className="meta__row">
            <dt className="meta__label">Email</dt>
            <dd className="meta__value">
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
          </div>
          <div className="meta__row">
            <dt className="meta__label">Based in</dt>
            <dd className="meta__value">{currentRole.location}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
