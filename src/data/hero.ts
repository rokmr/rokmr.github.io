import type { IconName } from '../components/Icon';
import type { TargetSpec } from '../lib/flow/targets';
import { currentRole } from './experience';
import { firstPublication, latestPublication } from './publications';
import { site, socialLinks } from './site';

// Content for the landing section: a research-paper title page.

export const heroTitle = 'Bridging Computer Vision & LLMs in Production';

export const heroDek =
  "I've trained CNNs to see and transformers to reason. Now I build systems where both work together.";

/** Distill-style byline. A line may link to the section that backs it up. */
export type BylineLine = { text: string; href?: string };
export type BylineCell = { label: string; lines: [BylineLine, ...BylineLine[]] };

export const byline: BylineCell[] = [
  { label: 'Affiliation', lines: [{ text: currentRole.company }, { text: 'IISc Bangalore, alumnus' }] },
  { label: 'Works on', lines: [{ text: 'Diffusion models' }, { text: 'Agentic RAG · evals' }] },
  {
    label: 'Published',
    lines: [
      { text: firstPublication.venueShort, href: '#research' },
      { text: latestPublication.venueShort, href: '#research' },
    ],
  },
];

/** The project-page link row. The first entry is the primary action. */
export type HeroLink = { href: string; label: string; icon: IconName; external?: boolean; me?: boolean };

/** Profiles shown in the hero, in order; labels and URLs come from socialLinks. */
const HERO_PROFILES = ['scholar', 'github', 'linkedin', 'huggingface', 'blog'] as const;

export const heroLinks: HeroLink[] = [
  { href: `mailto:${site.email}`, label: 'Email', icon: 'mail' },
  ...HERO_PROFILES.map((key) => {
    const link = socialLinks.find((l) => l.key === key);
    if (!link) throw new Error(`socialLinks has no "${key}"`);
    return { href: link.url, label: link.label, icon: link.icon, external: true, me: link.me };
  }),
];

/**
 * What Figure 1's noise resolves into. Any transparent-background image
 * works; `{ kind: 'twoMoons' | 'eightGaussians' | 'checkerboard' | 'lorenz' }`
 * draws a synthetic distribution instead.
 */
export const heroTarget: TargetSpec = {
  kind: 'image',
  src: `${import.meta.env.BASE_URL}assets/images/gradi.webp`,
  label: 'Gradi',
};
