import { SectionHeader } from '../SectionHeader';
import { skills } from '../../data/skills';

export function Skills() {
  return (
    <section id="skills" aria-label="Technical Skills">
      <SectionHeader id="skills" />
      <div className="skills-grid">
        {skills.map((category) => (
          <div className="skill-category" key={category.name}>
            <h3>{category.name}</h3>
            <div className="skill-list">
              {category.items.map((item) => (
                <span className="skill-item" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
