import { Icon } from './Icon';
import { navLinks, site, type SectionId } from '../data/site';
import type { MobileNavState } from '../hooks/useMobileNav';

type HeaderProps = {
  nav: MobileNavState;
  /** Past the top of the page: the header shows its bar and border. */
  scrolled: boolean;
  /** The section the reader is in, marked in the nav. */
  active: SectionId | null;
};

export function Header({ nav, scrolled, active }: HeaderProps) {
  const current = (href: string) => (active && href === `#${active}` ? 'true' : undefined);
  return (
    <>
      <header role="banner" data-scrolled={scrolled ? '' : undefined}>
        <a href="#home" className="logo" aria-label="Rohit Kumar - Home">
          ROHIT KUMAR
        </a>
        <nav aria-label="Main navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={nav.onNavClick} aria-current={current(link.href)}>
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
          <a href={site.blogUrl} className="pill">
            <Icon name="blog" size={14} />
            Blog
          </a>
          <a href={`mailto:${site.email}?subject=Collaboration`} className="pill pill--primary">
            <Icon name="users" size={14} />
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
            <a key={link.href} href={link.href} onClick={nav.onNavClick} aria-current={current(link.href)}>
              {link.label}
            </a>
          ))}
          <div className="mobile-nav-cta">
            <a href={site.blogUrl} className="pill">
              <Icon name="blog" size={14} />
              Blog
            </a>
            <a href={`mailto:${site.email}?subject=Collaboration`} className="pill pill--primary">
              <Icon name="users" size={14} />
              Collaborate
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
