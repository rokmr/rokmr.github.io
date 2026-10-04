import { SectionHeader } from '../SectionHeader';
import { Icon } from '../Icon';
import { ExternalLink } from '../ExternalLink';
import { site, socialLinks } from '../../data/site';

export function Contact() {
  return (
    <section id="contact" aria-label="Contact Information">
      <SectionHeader number="08" title="Contact" />
      <div className="contact-grid">
        <div className="contact-info">
          <h2>Let's Build Something Together</h2>
          <p>
            Looking for collaboration on AI/ML projects, research opportunities, or just want to
            chat about generative models and agentic systems.
          </p>
          <a href={`mailto:${site.email}`} className="contact-email">
            <Icon name="mail" />
            {site.email}
          </a>
        </div>

        <div className="social-grid">
          {socialLinks.map((link) => (
            <ExternalLink
              key={link.key}
              href={link.url}
              me={link.me}
              className="social-link"
              aria-label={link.key === 'blog' ? 'Blog' : `${link.label} profile`}
            >
              <Icon name={link.icon} size={18} />
              <span>{link.label}</span>
            </ExternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}
