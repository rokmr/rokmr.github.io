import type { MouseEventHandler } from 'react';
import { Icon } from '../Icon';
import { heroDek, heroLinks } from '../../data/hero';
import { currentRole } from '../../data/experience';
import { site } from '../../data/site';
import { ExternalLink } from '../ExternalLink';

/** Introduce the person, show evidence, and make the next step explicit. */
export function Hero({ onNavClick }: { onNavClick: MouseEventHandler }) {

  return (
    <section className="hero" id="home" aria-label="Introduction to Rohit Kumar">
      <div className="portfolio-opening">
        <div className="portfolio-intro">
          <div className="portfolio-identity">
            <picture>
              <source srcSet="assets/images/profile.webp" type="image/webp" />
              <img src="assets/images/profile.png" alt="" width={80} height={80} decoding="async" />
            </picture>
            <div>
              <h1>{site.name}</h1>
              <p className="portfolio-role">AI engineer & researcher</p>
            </div>
          </div>
          <p className="portfolio-bio">{heroDek}</p>
          <p className="portfolio-background">{currentRole.company} · M.Tech in AI, IISc Bangalore.</p>

          <div className="portfolio-actions">
            <a href={`mailto:${site.email}?subject=Opportunity%20or%20collaboration`} className="pill pill--primary pill--action">
              <Icon name="mail" />
              Get in touch
            </a>
            <a href="#projects" onClick={onNavClick} className="portfolio-experience">
              <span>Explore my work</span><Icon name="arrowDown" />
            </a>
          </div>
          <p className="portfolio-contact-context">For roles, research collaborations, and freelance projects.</p>
          <div className="portfolio-profiles" aria-label="Professional profiles">
            {heroLinks.map((link) => (
              <ExternalLink key={link.label} href={link.href} me className="profile-link">
                <Icon name={link.icon} size={16} /><span>{link.label}</span>
              </ExternalLink>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
