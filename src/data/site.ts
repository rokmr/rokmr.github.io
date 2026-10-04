// Single source of truth for identity, URLs and the nav. Referenced by both the
// rendered page and the per-route <head> builders in src/seo.
export const site = {
  origin: 'https://rohit.vision',
  email: 'contact@rohit.vision',
  blogUrl: 'https://blogs.rohit.vision/',
  name: 'Rohit Kumar',
  role: 'AI Engineer @ Armada AI',
  themeColor: '#0a0a0a',
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
  { id: 'about', title: 'About', nav: 'About' },
  { id: 'experience', title: 'Work Experience', nav: 'Experience' },
  { id: 'research', title: 'Research', nav: 'Research' },
  { id: 'projects', title: 'Projects', nav: 'Projects' },
  { id: 'skills', title: 'Skills', nav: 'Skills' },
  { id: 'education', title: 'Education', nav: 'Education' },
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

export const heroStats = [
  { value: '221', label: 'GATE AIR (EE)', href: '#education' },
  // Replaced the second GATE rank: the two ranks signalled the same thing,
  // and screen zero had nothing about published research.
  { value: '2', label: 'Publications', href: '#research' },
  { value: '2+', label: 'Years ML', href: '#experience' },
  { value: 'IISc', label: 'M.Tech AI', href: '#education' },
] as const;

export const socialLinks = [
  { key: 'linkedin', url: socialUrls.linkedin, label: 'LinkedIn', icon: 'linkedin', me: true },
  { key: 'github', url: socialUrls.github, label: 'GitHub', icon: 'github', me: true },
  { key: 'x', url: socialUrls.x, label: 'X', icon: 'x', me: true },
  { key: 'scholar', url: socialUrls.scholar, label: 'Google Scholar', icon: 'scholar', me: true },
  { key: 'huggingface', url: socialUrls.huggingface, label: 'HuggingFace', icon: 'huggingface', me: true },
  { key: 'blog', url: site.blogUrl, label: 'Blog', icon: 'blog', me: false },
] as const;

// Terminal typewriter lines for the hero HUD.
export const terminalMessages = [
  'rohit@iisc:~$ python inference.py',
  'torch.cuda.is_available() → True',
  'Loading checkpoint: best_model.pt',
  'Model loaded. 847M params',
  'Ready.',
] as const;
