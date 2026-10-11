import { SectionHeader } from '../SectionHeader';
import { Icon } from '../Icon';
import { ExternalLink } from '../ExternalLink';
import { publications, venueDetail } from '../../data/publications';
import { keepHyphens } from '../../lib/text';
import { service } from '../../data/service';
import { useCitationCount } from '../../hooks/useCitationCount';

/**
 * Builds the author line, merging adjacent plain-text runs into single strings.
 * Emitting one node per author would make React insert <!-- --> text-node
 * separators between them, which clutters the markup crawlers read.
 */
function renderAuthors(authors: (typeof publications)[number]['authors']) {
  const out: React.ReactNode[] = [];
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

/**
 * The "Cited by" sidenote. Renders nothing while the count is zero — a row
 * reading "0" says less than no row — and appears on its own once the live
 * count from Semantic Scholar rises above zero.
 */
function CitedBy({
  arxivId,
  fallback,
  citedByUrl,
}: NonNullable<(typeof publications)[number]['citations']>) {
  const count = useCitationCount(arxivId, fallback);
  if (count <= 0) return null;
  const text = `${count} ${count === 1 ? 'citation' : 'citations'}`;
  return (
    <div className="meta__row">
      <dt className="meta__label">Cited by</dt>
      <dd className="meta__value">
        <ExternalLink href={citedByUrl} aria-label={`${text}: see citing papers`}>
          {text}
        </ExternalLink>
      </dd>
    </div>
  );
}

/**
 * Publications and academic service in one section.
 *
 * These were separate sections five apart, which left the reviewer
 * invitations stranded near the foot of the page where they did nothing to
 * reinforce the papers.
 */
export function Research() {
  return (
    <section id="research" aria-label="Research: publications and academic service">
      {/* Back-compat anchor: the old section was #publications and that URL is
          in the structured data, the sitemap's breadcrumb and any inbound link. */}
      <span id="publications" aria-hidden="true" />

      <SectionHeader id="research" />

      {/* Each paper is a page-grid row: title, authors and links in the main
          column; venue and citations in the margin column. */}
      <ol className="pub-list">
        {publications.map((pub) => (
          <li className="pub l-margin" key={pub.title}>
            <div>
              <h3 className="pub-title">
                {keepHyphens(pub.title)}
                {pub.isNew && <span className="tag pub-new">New</span>}
              </h3>
              <p className="pub-authors">{renderAuthors(pub.authors)}</p>
              <div className="pill-row pub-links">
                {pub.links.map((link) => (
                  <ExternalLink
                    key={link.href}
                    href={link.href}
                    className="pill"
                    aria-label={link.ariaLabel}
                  >
                    <Icon name={link.icon} size={14} round={false} />
                    {link.label}
                  </ExternalLink>
                ))}
              </div>
            </div>
            <dl className="meta">
              <div className="meta__row">
                <dt className="meta__label">Venue</dt>
                <dd className="meta__value">
                  {pub.venueShort}
                  {venueDetail(pub) && <span className="meta__sub">{venueDetail(pub)}</span>}
                </dd>
              </div>
              {pub.citations && <CitedBy {...pub.citations} />}
            </dl>
          </li>
        ))}
      </ol>

      <h3 className="subsection-title" id="service">
        Academic Service
      </h3>
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
