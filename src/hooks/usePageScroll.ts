import { useEffect, useState } from 'react';
import { sections, type SectionId } from '../data/site';

/**
 * Where the reader is on the page, for the header:
 * - `scrolled`: past the very top, so the header gains its bar and border
 *   (over the hero it stays clear);
 * - `active`: the section in the middle band of the viewport, for the nav's
 *   current-location marker; null over the hero.
 *
 * Both change rarely, so they live in React state; the scroll listener only
 * sets state when the answer flips.
 */
export function usePageScroll(): { scrolled: boolean; active: SectionId | null } {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    // A section is current while it crosses a thin band just above the
    // middle of the viewport, so exactly one is current at a time.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    els.forEach((el) => observer.observe(el));

    // Back over the hero, nothing is current.
    const hero = document.getElementById('home');
    const heroObserver = hero
      ? new IntersectionObserver(([entry]) => {
          if (entry?.isIntersecting) setActive(null);
        }, { rootMargin: '-40% 0px -55% 0px' })
      : null;
    if (hero) heroObserver?.observe(hero);

    return () => {
      observer.disconnect();
      heroObserver?.disconnect();
    };
  }, []);

  return { scrolled, active };
}
