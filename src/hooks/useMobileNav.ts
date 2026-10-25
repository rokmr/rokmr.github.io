import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';

export type MobileNavState = {
  open: boolean;
  toggle: () => void;
  close: () => void;
  /** Close the drawer; native anchors preserve URL history and motion preferences. */
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
      if (e.key === 'Escape') {
        close();
        document.querySelector<HTMLButtonElement>('[aria-controls="mobile-nav"]')?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  // Keep the scroll lock from surviving a resize into desktop navigation.
  // Matches the header breakpoint in main.css.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1101px)');
    const onDesktop = () => { if (desktop.matches) close(); };
    desktop.addEventListener('change', onDesktop);
    return () => desktop.removeEventListener('change', onDesktop);
  }, [close]);

  const onNavClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute('href');
      if (!href?.startsWith('#')) return;
      close();
    },
    [close],
  );

  return useMemo(() => ({ open, toggle, close, onNavClick }), [open, toggle, close, onNavClick]);
}
