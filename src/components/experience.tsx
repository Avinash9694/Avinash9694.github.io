import { roles } from '../data/experience';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import styles from './experience.module.css';

export function Experience() {
  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          id="experience-title"
          title="Four years, three teams, one habit: ship things that hold up"
        />

        <ol className={styles.timeline}>
          {roles.map((role, i) => (
            <Reveal
              as="li"
              key={`${role.company}-${role.period}`}
              className={styles.item}
              delay={i * 60}
            >
              <div className={styles.marker} aria-hidden="true" />
              <header className={styles.header}>
                <div>
                  <h3 className={styles.company}>{role.company}</h3>
                  <p className={styles.role}>{role.title}</p>
                </div>
                <p className={`${styles.period} mono`}>
                  {role.period}
                  {role.meta ? <span className={styles.meta}>{role.meta}</span> : null}
                </p>
              </header>
              <ul className={styles.bullets}>
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
