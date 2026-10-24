import { skillGroups } from '../data/skills';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import styles from './skills.module.css';

export function Skills() {
  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading
          index="03"
          eyebrow="Skills"
          id="skills-title"
          title="What I reach for"
          lede="Grouped by where it runs. No percentages — the projects above are the evidence."
        />

        <div className={styles.groups}>
          {skillGroups.map((group, i) => (
            <Reveal key={group.name} className={styles.group} delay={i * 60}>
              <h3 className={styles.groupName}>{group.name}</h3>
              <ul className={styles.chips} aria-label={group.name}>
                {group.items.map((item) => (
                  <li key={item} className={styles.chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
