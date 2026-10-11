import type { IconName } from '../components/Icon';

export type Publication = {
  title: string;
  /**
   * Authors in order. `self` bolds the name; `suffix` carries markers such as
   * the equal-contribution asterisk, which sits outside the bold.
   */
  authors: { name: string; self?: boolean; suffix?: string }[];
  venue: string;
  /** Compact venue for bylines and sidenotes, e.g. "WACV 2025". */
  venueShort: string;
  isNew?: boolean;
  /**
   * Live citation count, refreshed client-side from Semantic Scholar.
   * `fallback` is what ships in the prerendered HTML; `citedByUrl` is where
   * the count links (Google Scholar's "cited by" list when it exists).
   */
  citations?: { arxivId: string; fallback: number; citedByUrl: string };
  links: { href: string; label: string; icon: IconName; ariaLabel: string }[];
};

export const publications: Publication[] = [
  {
    title:
      'AttriStory: Fine-Grained Attribute Realization for Visual Storytelling with Diffusion Models',
    authors: [
      { name: 'Manogna Sreenivas' },
      { name: 'Rohit Kumar', self: true },
      { name: 'Soma Biswas' },
    ],
    venue: 'CVPR 2026 Workshop on Generative AI for Storytelling (AISTORY)',
    venueShort: 'CVPR 2026 Workshop',
    isNew: true,
    citations: {
      arxivId: '2605.20777',
      // Semantic Scholar has not indexed the citing paper yet; the live
      // count only ever raises this, never lowers it.
      fallback: 1,
      // No Google Scholar "cited by" list yet; Semantic Scholar's citing papers.
      citedByUrl:
        'https://www.semanticscholar.org/paper/7d14da101fd6b4977083d7f0fb3bd2266264181c#citing-papers',
    },
    links: [
      {
        href: 'https://openaccess.thecvf.com/content/CVPR2026W/AISTORY/papers/Sreenivas_AttriStory_Fine-Grained_Attribute_Realization_for_Visual_Storytelling_with_Diffusion_Models_CVPRW_2026_paper.pdf',
        label: 'Paper',
        icon: 'file',
        ariaLabel: 'AttriStory paper PDF from CVPR 2026 Workshop',
      },
      {
        href: 'https://arxiv.org/abs/2605.20777',
        label: 'arXiv',
        icon: 'file',
        ariaLabel: 'AttriStory paper on arXiv',
      },
      {
        href: 'https://manogna-s.github.io/attristory/',
        label: 'Website',
        icon: 'globe',
        ariaLabel: 'AttriStory project website',
      },
      {
        href: 'assets/AttriStory-Poster.pdf',
        label: 'Poster',
        icon: 'poster',
        ariaLabel: 'AttriStory CVPR 2026 poster',
      },
    ],
  },
  {
    title:
      'TACLE: Task and Class-aware Exemplar-free Semi-supervised Class Incremental Learning',
    authors: [
      { name: 'Jayateja Kalla', suffix: '*' },
      { name: 'Rohit Kumar', self: true, suffix: '*' },
      { name: 'Soma Biswas' },
    ],
    venue: 'WACV 2025',
    venueShort: 'WACV 2025',
    citations: {
      arxivId: '2407.08041',
      fallback: 1,
      citedByUrl:
        'https://scholar.google.com/scholar?cites=620960889489791150&as_sdt=2005&sciodt=0,5&hl=en',
    },
    links: [
      {
        href: 'https://openaccess.thecvf.com/content/WACV2025/papers/Kalla_TACLE_Task_and_Class-Aware_Exemplar-Free_Semi-Supervised_Class_Incremental_Learning_WACV_2025_paper.pdf',
        label: 'Paper',
        icon: 'file',
        ariaLabel: 'TACLE paper PDF from WACV 2025',
      },
      {
        href: 'https://arxiv.org/pdf/2407.08041',
        label: 'arXiv',
        icon: 'file',
        ariaLabel: 'TACLE paper on arXiv',
      },
      {
        href: 'https://github.com/rokmr/TACLE',
        label: 'Code',
        icon: 'github',
        ariaLabel: 'TACLE source code on GitHub',
      },
      {
        href: 'https://rohit.vision/tacle/',
        label: 'Website',
        icon: 'globe',
        ariaLabel: 'TACLE project website',
      },
      {
        href: 'https://rohit.vision/tacle/assets/wacv25-0789.pdf',
        label: 'Poster',
        icon: 'poster',
        ariaLabel: 'TACLE WACV 2025 poster',
      },
      {
        href: 'https://openaccess.thecvf.com/content/WACV2025/supplemental/Kalla_TACLE_Task_and_WACV_2025_supplemental.pdf',
        label: 'Supplementary',
        icon: 'fileLines',
        ariaLabel: 'TACLE supplementary material',
      },
    ],
  },
];

/** The name a paper goes by: its title up to the colon ("TACLE", "AttriStory"). */
export function paperName(pub: Publication): string {
  return pub.title.split(':')[0]!.trim();
}

/**
 * The part of the full venue that the short form leaves out, e.g.
 * "Generative AI for Storytelling (AISTORY)" for the CVPR workshop; empty
 * when the short form says it all.
 */
export function venueDetail(pub: Publication): string {
  if (pub.venue === pub.venueShort) return '';
  if (!pub.venue.startsWith(pub.venueShort)) return pub.venue;
  return pub.venue
    .slice(pub.venueShort.length)
    .replace(/^\s*(on|:|-|—)?\s*/, '')
    .trim();
}

/** Newest first, as listed. */
export const latestPublication = publications[0]!;
export const firstPublication = publications[publications.length - 1]!;
