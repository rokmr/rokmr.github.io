import type { ReactNode } from 'react';
import { SectionHeader } from '../SectionHeader';
import { currentRole, previousRole } from '../../data/experience';
import { firstPublication, latestPublication, paperName } from '../../data/publications';

/**
 * About, written as the abstract under the title page. Facts that used to be
 * hero stat tiles sit beside the sentence they support, as sidenotes (after
 * Tufte / distill.pub). Each row is an .l-margin grid — paragraph in the main
 * column, notes (.meta) in the margin column the hero byline also uses — so
 * they stay aligned with no measuring script, and drop beneath their
 * paragraph on narrow screens.
 *
 * This deliberately stops short of a CV: Experience and Research follow
 * immediately and cover employers and papers in full. Notes that restate
 * those sections are derived from the same data, so they cannot drift.
 */

type Note = { label: string; value: string; href?: string };

const rows: { text: ReactNode; notes: Note[] }[] = [
  {
    text: (
      <>
        I'm an electrical engineer who ended up in AI. After clearing <strong>GATE</strong> and{' '}
        <strong>BARC</strong>, I chose research over a government job — which took me to{' '}
        <strong>IISc Bangalore</strong> and my first paper, on exemplar‑free continual learning.
      </>
    ),
    notes: [
      { label: 'GATE 2022', value: 'AIR 221 (EE) · AIR 227 (IN)', href: '#education' },
      { label: 'IISc', value: 'M.Tech, Artificial Intelligence', href: '#education' },
      {
        label: 'First paper',
        value: `${paperName(firstPublication)}, ${firstPublication.venueShort}`,
        href: '#research',
      },
    ],
  },
  {
    text: (
      <>
        Since then I've worked where models meet users: <strong>diffusion pipelines</strong> that
        shipped photorealistic product imagery at Avataar AI, and now{' '}
        <strong>agentic AI systems</strong> at Armada AI, where I own retrieval, evals and
        observability end to end.
      </>
    ),
    notes: [
      { label: 'Now', value: `${currentRole.title}, ${currentRole.company}`, href: '#experience' },
      {
        label: 'Before',
        value: `${previousRole.title}, ${previousRole.company}`,
        href: '#experience',
      },
    ],
  },
  {
    text: (
      <>
        The boundary between what machines see and what they understand keeps blurring. I build at
        that edge, and I still publish — most recently on fine‑grained attribute control in
        diffusion‑based visual storytelling.
      </>
    ),
    notes: [
      {
        label: 'Latest',
        value: `${paperName(latestPublication)}, ${latestPublication.venueShort}`,
        href: '#research',
      },
      { label: 'Reading', value: 'Reinforcement learning' },
    ],
  },
];

export function About() {
  return (
    <section id="about" aria-label="About Rohit Kumar">
      <SectionHeader id="about" />
      <div className="abstract">
        {rows.map((row, i) => (
          <div className="abstract-row l-margin" key={row.notes[0]!.label}>
            <p className={i === 0 ? 'abstract-text abstract-lead' : 'abstract-text'}>{row.text}</p>
            <dl className="meta">
              {row.notes.map((note) => (
                <div className="meta__row" key={note.label}>
                  <dt className="meta__label">{note.label}</dt>
                  <dd className="meta__value">
                    {note.href ? <a href={note.href}>{note.value}</a> : note.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
