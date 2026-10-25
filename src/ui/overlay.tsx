import { SECTIONS } from '../data/site';
import { sectionFromProgress } from '../lib/progress-map';
import { goToSection } from '../lib/scroll-controller';
import { useSceneStore } from '../store/scene-store';
import styles from './overlay.module.css';
import { AboutPanel } from './panels/about-panel';
import { ContactPanel } from './panels/contact-panel';
import { ExperiencePanel } from './panels/experience-panel';
import { HeroPanel } from './panels/hero-panel';
import { ProjectsPanel } from './panels/projects-panel';

const PANELS = [HeroPanel, AboutPanel, ExperiencePanel, ProjectsPanel, ContactPanel] as const;

/**
 * The five sections live in the DOM at once so readers and crawlers see everything;
 * only the one the camera is at is visible. Focusing into a hidden one brings the camera.
 */
export function Overlay() {
  const active = useSceneStore((s) => sectionFromProgress(s.progress));
  return (
    <main id="main" className={styles.main}>
      {SECTIONS.map((section, i) => {
        const Panel = PANELS[i];
        if (!Panel) return null;
        return (
          <section
            key={section.id}
            id={section.id}
            className={`${styles.section} ${styles[section.id] ?? ''}`}
            data-active={i === active}
            aria-labelledby={i === 0 ? undefined : `${section.id}-title`}
            aria-label={i === 0 ? 'Introduction' : undefined}
            onFocus={() => i !== active && goToSection(i)}
          >
            <Panel />
          </section>
        );
      })}
    </main>
  );
}
