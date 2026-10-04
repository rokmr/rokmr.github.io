import type { ReactNode } from 'react';
import { SectionHeader } from '../SectionHeader';
import { Icon } from '../Icon';
import { ExternalLink } from '../ExternalLink';
import { publications } from '../../data/publications';
import { useCitationCount } from '../../hooks/useCitationCount';

/**
 * Builds the author line, merging adjacent plain-text runs into single strings.
 * Emitting one node per author would make React insert <!-- --> text-node
 * separators between them, which clutters the markup crawlers read.
 */
function renderAuthors(authors: (typeof publications)[number]['authors']): ReactNode[] {
  const out: ReactNode[] = [];
  let buffer = '';
  const flush = () => {
    if (buffer) {
      out.push(buffer);
      buffer = '';
    }
  };

  authors.forEach((author, i) => {
    const tail = (author.suffix ?? '') + (i < authors.length - 1 ? ', ' : '');
    if (author.self) {
      flush();
      out.push(<strong key={author.name}>{author.name}</strong>);
      buffer += tail;
    } else {
      buffer += author.name + tail;
    }
  });

  flush();
  return out;
}

function Citations({
  arxivId,
  fallback,
  scholarUrl,
}: NonNullable<(typeof publications)[number]['citations']>) {
  const count = useCitationCount(arxivId, fallback);
  return (
    <span className="pub-citations">
      <Icon name="barChart" size={12} round={false} />{' '}
      <ExternalLink href={scholarUrl} aria-label="TACLE citation count on Google Scholar">
        Cited by {count}
      </ExternalLink>
    </span>
  );
}

export function Publications() {
  return (
    <section id="publications" aria-label="Research Publications">
      <SectionHeader number="04" title="Publications" />
      {publications.map((pub) => (
        <article className="publication-card" key={pub.title}>
          {pub.isNew && <div className="pub-new-badge">New</div>}
          <h3 className="pub-title">{pub.title}</h3>
          <p className="pub-authors">{renderAuthors(pub.authors)}</p>
          <p className="pub-venue">
            {pub.venue}
            {pub.citations && (
              <>
                {' '}
                <Citations {...pub.citations} />
              </>
            )}
          </p>
          <div className="pub-links">
            {pub.links.map((link) => (
              <ExternalLink key={link.href} href={link.href} aria-label={link.ariaLabel}>
                <Icon name={link.icon} size={14} round={false} />
                {link.label}
              </ExternalLink>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
