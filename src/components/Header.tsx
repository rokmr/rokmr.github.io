import { Icon } from './Icon';
import { navLinks, site, type SectionId } from '../data/site';
import type { MobileNavState } from '../hooks/useMobileNav';

type HeaderProps = { nav: MobileNavState; scrolled: boolean; active: SectionId | null };

/** One navigation model: persistent rail on desktop, compact drawer below. */
export function Header({ nav, scrolled, active }: HeaderProps) {
  const links = [{ href: '#home', label: 'Overview' }, ...navLinks];
  const current = (href: string) => href === (active ? `#${active}` : '#home') ? 'location' as const : undefined;

  return (
    <>
      <header className="site-header" data-scrolled={scrolled ? '' : undefined}>
        <a href="#home" className="logo" aria-label="Rohit Kumar - Home" onClick={nav.onNavClick}>{site.name}</a>
        <p className="sidebar-description">AI engineer & researcher</p>
        <nav className="desktop-nav" aria-label="Portfolio sections">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={nav.onNavClick} aria-current={current(link.href)}>
              <span className="nav-position" aria-hidden="true" /><span>{link.label}</span>
            </a>
          ))}
        </nav>
        <div className="header-cta">
          <a href={`mailto:${site.email}?subject=Opportunity%20or%20collaboration`} className="pill pill--primary"><Icon name="mail" size={16} />Get in touch</a>
          <a href={site.blogUrl} className="sidebar-blog"><Icon name="blog" size={16} />Writing</a>
        </div>
        <button className={`mobile-menu-btn${nav.open ? ' active' : ''}`} aria-label={nav.open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={nav.open} aria-controls="mobile-nav" onClick={nav.toggle}>
          <span /><span /><span />
        </button>
      </header>
      <div className={`mobile-nav-overlay${nav.open ? ' active' : ''}`} aria-hidden="true" onClick={nav.close} />
      <nav id="mobile-nav" className={`mobile-nav${nav.open ? ' active' : ''}`} hidden={!nav.open} aria-label="Portfolio sections">
        <div className="mobile-nav-inner">
          {links.map((link) => <a key={link.href} href={link.href} onClick={nav.onNavClick} aria-current={current(link.href)}>{link.label}</a>)}
          <div className="mobile-nav-cta">
            <a href={`mailto:${site.email}`} className="pill pill--primary"><Icon name="mail" />Get in touch</a>
            <a href={site.blogUrl} className="pill"><Icon name="blog" />Writing</a>
          </div>
        </div>
      </nav>
    </>
  );
}
