import { useEffect, useState } from 'react';
import { sections, type SectionId } from '../data/site';

export function activeSectionAt(tops: { id: SectionId; top: number }[], scrollY: number, viewport: number, pageHeight: number): SectionId | null {
  if (scrollY > 0 && scrollY + viewport >= pageHeight - 2) return 'contact';
  const band = Math.min(180, viewport * .25);
  let active: SectionId | null = null;
  for (const section of tops) if (section.top <= band) active = section.id;
  return active;
}

export function usePageScroll(): { scrolled: boolean; active: SectionId | null } {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const tops = sections.flatMap(({ id }) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
      });
      setScrolled(window.scrollY > 8);
      setActive(activeSectionAt(tops, window.scrollY, window.innerHeight, document.documentElement.scrollHeight));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    window.addEventListener('load', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.querySelector('main') ?? document.body);
    update();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule); window.removeEventListener('load', schedule);
    };
  }, []);
  return { scrolled, active };
}
