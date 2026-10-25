import { professionalFocus } from './positioning';
import type { TargetSpec } from '../lib/flow/targets';
import { socialLinks } from './site';

// Homepage overview. Employment and publication metadata stay derived.
export const heroDek = professionalFocus;

const HERO_PROFILES = ['github', 'scholar', 'linkedin'] as const;
export const heroLinks = HERO_PROFILES.map((key) => {
  const link = socialLinks.find((entry) => entry.key === key);
  if (!link) throw new Error(`Missing social profile: ${key}`);
  return { href: link.url, label: link.label, icon: link.icon, me: link.me };
});

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
