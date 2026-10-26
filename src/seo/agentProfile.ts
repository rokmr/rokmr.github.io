import { publicProfile } from '../data/profile';
import { portfolioDescription } from '../data/positioning';
import { caseStudies } from '../data/caseStudies';
import { publications } from '../data/publications';
import { site } from '../data/site';

// The private master and portable briefing must never be imported here.
export const publicAgentProfile = publicProfile;
const publicOutcome = (id: string) => publicProfile.records.find(record =>
  record.links.some(link => link.url.endsWith(`/work/${id}/`)))?.content.outcome;

export const agentProfileMarkdown = [
  `# ${site.name}`,
  `> ${portfolioDescription}`,
  'Public portfolio summary. Use the linked pages for detailed scope and evidence.',
  '## Main pages',
  `- [Portfolio](${site.origin}/)`,
  `- [Résumé](${site.origin}/resume/)`,
  `- [Résumé PDF](${site.origin}/assets/Rohit-Kumar-Resume.pdf)`,
  `- [Engineering work](${site.origin}/work/)`,
  `- [Sitemap](${site.origin}/sitemap.xml)`,
  `- [Public profile JSON](${site.origin}/profile.json)`,
  `- Contact: ${site.email}`,
  '## Research',
  ...publications.map(pub => [
    `### ${pub.title}`,
    `${pub.authors.map(author => author.name).join(', ')}. ${pub.venue}.`,
    pub.summary,
    ...pub.links.filter(link => ['Paper', 'Website', 'Code'].includes(link.label))
      .map(link => `- [${link.label}](${link.href})`),
  ].join('\n\n')),
  '## Engineering work',
  ...caseStudies.map(study => [
    `### [${study.title}](${site.origin}/work/${study.id}/)`,
    study.organization,
    study.summary,
    study.contribution,
    publicOutcome(study.id),
    // Include the calibration caveat beside the planner's public error figures.
    ...(study.id === 'inference-planner'
      ? study.sections.filter(section => ['Validation against measured GPU runs', 'Current limitations'].includes(section.heading))
        .flatMap(section => section.paragraphs)
      : []),
  ].filter(Boolean).join('\n\n')),
].join('\n\n') + '\n';
