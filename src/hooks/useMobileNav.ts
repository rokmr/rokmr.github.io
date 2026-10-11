import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';

export type MobileNavState = {
  open: boolean;
  toggle: () => void;
  close: () => void;
  /** Smooth-scrolls in-page anchors and closes the drawer. */
  onNavClick: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function useMobileNav(): MobileNavState {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  // The drawer locks page scroll; the class is on <body>, so it is applied here
  // rather than in JSX.
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const onNavClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute('href');
      if (!href?.startsWith('#')) return;
      e.preventDefault();
      close();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    },
    [close],
  );

  return useMemo(() => ({ open, toggle, close, onNavClick }), [open, toggle, close, onNavClick]);
}
