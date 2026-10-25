import { ResearchExperiment } from '../ResearchExperiment';
import { SectionHeader } from '../SectionHeader';
import { Icon } from '../Icon';
import { ExternalLink } from '../ExternalLink';
import { publications, venueDetail, paperName } from '../../data/publications';
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
    <ExternalLink href={citedByUrl} className="pub-citations" aria-label={`${text}: see citing papers`}>
      <Icon name="barChart" size={14} />
      <span>{text}</span>
    </ExternalLink>
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

      <ol className="pub-list">
        {publications.map((pub) => {
          const paperLink = pub.links.find((link) => link.label === 'Paper');
          const titleId = `publication-${paperName(pub).toLowerCase()}`;
          return (
            <li className="pub" key={pub.title} aria-labelledby={titleId}>
              <div className="pub-meta">
                <p className="pub-venue">{pub.venueShort}</p>
                {venueDetail(pub) && <p className="pub-venue-detail">{venueDetail(pub)}</p>}
                {pub.isNew && <span className="pub-latest">Latest publication</span>}
                {pub.citations && <CitedBy {...pub.citations} />}
              </div>

              <div className="pub-body">
                <h3 className="pub-title" id={titleId}>
                  {paperLink ? (
                    <ExternalLink href={paperLink.href}>{keepHyphens(pub.title)}</ExternalLink>
                  ) : keepHyphens(pub.title)}
                </h3>
                <p className="pub-authors">{renderAuthors(pub.authors)}</p>
                <p className="pub-summary">{pub.summary}</p>
                <div className="pub-actions" aria-label={`${paperName(pub)} resources`}>
                  {pub.links.map((link) => (
                    <ExternalLink
                      key={link.href}
                      href={link.href}
                      className={link.label === 'Paper' ? 'pill pill--primary' : 'profile-link'}
                      aria-label={link.ariaLabel}
                    >
                      <Icon name={link.icon} size={16} />
                      <span>{link.label === 'Paper' ? 'Read paper' : link.label}</span>
                    </ExternalLink>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <h3 className="subsection-title" id="service">
        Academic Service
      </h3>
      <div className="service-list">
        {service.map((entry) => (
          <div className="service-item" key={entry.venue}>
            <span className="service-role">{entry.role}</span>
            <ExternalLink href={entry.venueUrl} className="service-venue">
              {entry.venue}
            </ExternalLink>
            <span className="service-desc">{entry.description}</span>
          </div>
        ))}
      </div>
      <ResearchExperiment />
    </section>
  );
}
