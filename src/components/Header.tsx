import { Icon } from './Icon';
import { navLinks, site } from '../data/site';
import type { MobileNavState } from '../hooks/useMobileNav';

export function Header({ nav }: { nav: MobileNavState }) {
  return (
    <>
      <header role="banner">
        <a href="#home" className="logo" aria-label="Rohit Kumar - Home">
          ROHIT KUMAR
        </a>
        <nav aria-label="Main navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={nav.onNavClick}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          className={`mobile-menu-btn${nav.open ? ' active' : ''}`}
          aria-label={nav.open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={nav.open}
          aria-controls="mobile-nav"
          onClick={nav.toggle}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="header-cta">
          <a href={site.blogUrl} className="cv-btn">
            <Icon name="blog" size={14} />
            Blog
          </a>
          <a href={`mailto:${site.email}?subject=Collaboration`} className="collab-btn">
            <Icon name="users" />
            Collaborate
          </a>
        </div>
      </header>

      <div
        className={`mobile-nav-overlay${nav.open ? ' active' : ''}`}
        aria-hidden="true"
        onClick={nav.close}
      />
      <nav
        id="mobile-nav"
        className={`mobile-nav${nav.open ? ' active' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="mobile-nav-inner">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={nav.onNavClick}>
              {link.label}
            </a>
          ))}
          <div className="mobile-nav-cta">
            <a href={site.blogUrl} className="mobile-blog-btn">
              <Icon name="blog" size={14} />
              Blog
            </a>
            <a href={`mailto:${site.email}?subject=Collaboration`} className="mobile-collab-btn">
              <Icon name="users" />
              Collaborate
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
