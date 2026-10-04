import { useEffect } from 'react';

/**
 * Fades sections in as they enter the viewport. Skipped entirely under
 * prefers-reduced-motion, which leaves sections at their default full opacity.
 */
export function useSectionReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = Array.from(document.querySelectorAll('main section'));
    sections.forEach((el) => el.classList.add('section-reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
