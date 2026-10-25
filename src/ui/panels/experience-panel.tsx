import { formatRange, roleYear, roles } from '../../data/experience';
import { hackathon } from '../../data/site';
import { activeRole } from '../../lib/progress-map';
import { goToRole } from '../../lib/scroll-controller';
import { useSceneStore } from '../../store/scene-store';
import styles from '../overlay.module.css';

export function ExperiencePanel() {
  const active = useSceneStore((s) => activeRole(s.progress));
  return (
    <div className={`panel ${styles.card}`}>
      <div className={styles.head}>
        <h2 className="eyebrow" id="experience-title">
          Experience
        </h2>
        <div className={styles.tabs} role="tablist" aria-label="Roles">
          {roles.map((role, i) => (
            <button
              key={role.company}
              type="button"
              role="tab"
              id={`role-tab-${i}`}
              className={styles.tab}
              aria-selected={i === active}
              aria-controls={`role-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => goToRole(i)}
            >
              {roleYear(role)}
            </button>
          ))}
        </div>
      </div>
      {roles.map((role, i) => (
        <div
          key={role.company}
          role="tabpanel"
          id={`role-${i}`}
          aria-labelledby={`role-tab-${i}`}
          className={styles.pane}
          data-active={i === active}
          onFocus={() => i !== active && goToRole(i)}
        >
          <h3 className={`display ${styles.title}`}>{role.company}</h3>
          <p className={styles.meta}>
            {role.title} <span aria-hidden="true">&middot;</span> {formatRange(role)}
          </p>
          <ul className={styles.bullets} data-lenis-prevent>
            {role.points.map((point) => (
              <li key={point.slice(0, 32)}>{point}</li>
            ))}
          </ul>
          {i === roles.length - 1 && <p className={styles.hackathon}>{hackathon}</p>}
        </div>
      ))}
    </div>
  );
}
