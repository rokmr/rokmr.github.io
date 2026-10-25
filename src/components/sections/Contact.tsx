import { CopyEmail } from '../CopyEmail';
import { SectionHeader } from '../SectionHeader';
import { Icon } from '../Icon';
import { ExternalLink } from '../ExternalLink';
import { site, socialLinks } from '../../data/site';
import { currentRole } from '../../data/experience';

/**
 * One primary email action, secondary profiles, and copyable contact details.
 */
export function Contact() {
  return (
    <section id="contact" aria-label="Contact Information">
      <SectionHeader id="contact" />
      <div className="contact l-margin">
        <div>
          <h2 className="contact-title">Work with me</h2>
          <p className="contact-text">
            For AI engineering roles, research collaborations, or freelance projects in computer
            vision and generative AI, send me a short note about what you have in mind.
            For project work, a brief scope and timeline are helpful.
          </p>
          <div className="pill-row contact-links">
            <a href={`mailto:${site.email}`} className="pill pill--primary pill--action">
              <Icon name="mail" size={16} />
              Email me
            </a>
          </div>
          <div className="contact-profiles" aria-label="More profiles and writing">
            {socialLinks.filter((link) => !['github', 'scholar', 'linkedin'].includes(link.key)).map((link) => (
              <ExternalLink
                key={link.key}
                href={link.url}
                me={link.me}
                className="profile-link"
                aria-label={link.key === 'blog' ? 'Blog' : `${link.label} profile`}
              >
                <Icon name={link.icon} size={16} />
                <span>{link.label}</span>
              </ExternalLink>
            ))}
          </div>
        </div>
        <dl className="meta">
          <div className="meta__row">
            <dt className="meta__label">Email</dt>
            <dd className="meta__value contact-email">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <CopyEmail />
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
