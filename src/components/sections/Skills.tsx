import { skills } from '../../data/skills';

/** Supporting information within Experience, rather than a separate tag wall. */
export function Skills() {
  return (
    <div id="skills" className="experience-capabilities">
      <h3 className="subsection-title">Tools & capabilities</h3>
      <dl className="capability-list">
        {skills.map((category) => <div key={category.name}><dt>{category.name}</dt><dd>{category.items.join(' · ')}</dd></div>)}
      </dl>
    </div>
  );
}
