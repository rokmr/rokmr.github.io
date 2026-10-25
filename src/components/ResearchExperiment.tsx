import { useState } from 'react';
import { HeroFigure } from './HeroFigure';
import { Icon } from './Icon';
import { heroTarget } from '../data/hero';

/** Optional technical exploration follows the research it illustrates. */
export function ResearchExperiment() {
  const [open, setOpen] = useState(false);
  return (
    <details className="portfolio-note" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>
        <span className="portfolio-note-label"><Icon name="play" size={14} /><span>Interactive experiment <span className="portfolio-note-description">/ Flow matching</span></span></span>
        <Icon name="chevronDown" />
      </summary>
      {open && <div className="portfolio-note-body"><HeroFigure target={heroTarget} /></div>}
    </details>
  );
}
