import { Icon } from './Icon';
import { useBackToTop } from '../hooks/useBackToTop';

export function BackToTop() {
  const visible = useBackToTop();

  return (
    <button
      className={`back-to-top${visible ? ' visible' : ''}`}
      aria-label="Back to top"
      // Hidden from the tab order until it is actually on screen.
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
    >
      <Icon name="chevronUp" size={18} strokeWidth={2} />
    </button>
  );
}
