import { publicProfile } from './profile';
// Single source of truth for identity, URLs and the nav. Referenced by both the
// rendered page and the per-route <head> builders in src/seo.
export const site = {
  origin: publicProfile.person.siteUrl,
  email: publicProfile.person.email,
  blogUrl: 'https://blogs.rohit.vision/',
  name: publicProfile.person.name,
  themeColor: '#f6f5f1',
  twitterHandle: '@rohitronie',
} as const;

export const socialUrls = {
  github: 'https://github.com/rokmr',
  linkedin: 'https://linkedin.com/in/rohitronie',
  x: 'https://x.com/rohitronie',
  scholar: 'https://scholar.google.com/citations?user=7N8THZgAAAAJ&hl=en',
  huggingface: 'https://huggingface.co/rokmr',
} as const;

/**
 * The page's sections, in render order. This is the single source of truth for
 * the nav, for the `01`/`02` prefixes in each section header, and for the order
 * in which Home composes them — so reordering a section here renumbers
 * everything instead of leaving the prefixes to drift out of sync by hand.
 */
export const sections = [
  { id: 'research', title: 'Research', nav: 'Research' },
  { id: 'projects', title: 'Engineering', nav: 'Work' },
  { id: 'experience', title: 'Experience', nav: 'Experience' },
  { id: 'about', title: 'Background', nav: 'Background' },
  { id: 'contact', title: 'Contact', nav: 'Contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export function sectionMeta(id: SectionId) {
  const index = sections.findIndex((s) => s.id === id);
  const section = sections[index];
  if (!section) throw new Error(`unknown section: ${id}`);
  return { ...section, number: String(index + 1).padStart(2, '0') };
}

export const navLinks = sections.map((s) => ({ href: `#${s.id}`, label: s.nav }));


export const socialLinks = [
  { key: 'linkedin', url: socialUrls.linkedin, label: 'LinkedIn', icon: 'linkedin', me: true },
  { key: 'github', url: socialUrls.github, label: 'GitHub', icon: 'github', me: true },
  { key: 'x', url: socialUrls.x, label: 'X', icon: 'x', me: true },
  { key: 'scholar', url: socialUrls.scholar, label: 'Google Scholar', icon: 'scholar', me: true },
  { key: 'huggingface', url: socialUrls.huggingface, label: 'Hugging Face', icon: 'huggingface', me: true },
  { key: 'blog', url: site.blogUrl, label: 'Blog', icon: 'blog', me: false },
] as const;
