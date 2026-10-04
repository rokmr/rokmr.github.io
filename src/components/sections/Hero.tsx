import type { MouseEventHandler } from 'react';
import { Icon } from '../Icon';
import { HeroFigure } from '../HeroFigure';
import { byline, heroDek, heroLinks, heroTarget, heroTitle } from '../../data/hero';
import { site } from '../../data/site';

/**
 * The landing section, laid out as a research-paper title page (after
 * distill.pub): title, dek and the project-page link row on the left, the
 * byline as a label/value column on the right, then Figure 1 full width.
 *
 * The title block is a <div>, not <header>/<nav>: main.css styles those
 * elements globally as the fixed top bar.
 */
export function Hero({ onNavClick }: { onNavClick: MouseEventHandler }) {
  return (
    <section className="hero" id="home">
      <div className="paper-head l-margin">
        <div className="paper-main">
          <h1 className="paper-title">{heroTitle}</h1>
          <p className="paper-dek">{heroDek}</p>

          <div className="paper-links pill-row">
            {heroLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className={i === 0 ? 'pill pill--primary' : 'pill'}
                {...(link.external
                  ? { target: '_blank', rel: link.me ? 'me noopener noreferrer' : 'noopener noreferrer' }
                  : {})}
              >
                <Icon name={link.icon} size={14} />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <dl className="meta paper-byline">
          <div className="meta__row paper-author">
            <dt className="meta__label">Author</dt>
            <dd className="meta__value">
              <picture>
                <source srcSet="assets/images/profile.webp" type="image/webp" />
                <img src="assets/images/profile.png" alt="" width={28} height={28} decoding="async" />
              </picture>
              {site.name}
            </dd>
          </div>
          {byline.map((cell) => (
            <div className="meta__row" key={cell.label}>
              <dt className="meta__label">{cell.label}</dt>
              <dd className="meta__value">
                {cell.lines.map((line, i) => {
                  const text = line.href ? (
                    <a href={line.href} onClick={onNavClick}>
                      {line.text}
                    </a>
                  ) : (
                    line.text
                  );
                  return i === 0 ? (
                    <span key={i}>{text}</span>
                  ) : (
                    <span key={i} className="meta__sub">
                      {text}
                    </span>
                  );
                })}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <HeroFigure target={heroTarget} />
    </section>
  );
}
