import { SECTIONS } from '../data/site';
import { sectionFromProgress } from '../lib/progress-map';
import { goToSection } from '../lib/scroll-controller';
import { useSceneStore } from '../store/scene-store';
import styles from './progress-rail.module.css';

export function ProgressRail() {
  const active = useSceneStore((s) => sectionFromProgress(s.progress));
  return (
    <nav className={styles.rail} aria-label="Progress">
      {SECTIONS.map((section, i) => (
        <button
          key={section.id}
          type="button"
          className={styles.item}
          aria-current={active === i ? 'true' : undefined}
          aria-label={`Go to ${section.label}`}
          onClick={() => goToSection(i)}
        >
          <span className={styles.label}>{section.label}</span>
          <span className={styles.line} aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
