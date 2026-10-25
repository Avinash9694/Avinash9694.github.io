import { SECTIONS, site } from '../data/site';
import { sectionFromProgress } from '../lib/progress-map';
import { goToSection } from '../lib/scroll-controller';
import { useSceneStore } from '../store/scene-store';
import { FileText } from './icons';
import styles from './top-bar.module.css';

export function TopBar() {
  const active = useSceneStore((s) => sectionFromProgress(s.progress));
  return (
    <header className={styles.bar}>
      <a
        className={styles.brand}
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          goToSection(0);
        }}
      >
        <span className={styles.dot} aria-hidden="true" />
        {site.name}
      </a>
      <nav className={styles.nav} aria-label="Sections">
        {SECTIONS.slice(1).map((section, i) => (
          <a
            key={section.id}
            className={styles.link}
            href={`#${section.id}`}
            aria-current={active === i + 1 ? 'true' : undefined}
            onClick={(e) => {
              e.preventDefault();
              goToSection(i + 1);
            }}
          >
            {section.label}
          </a>
        ))}
      </nav>
      <a className="btn btn-sm" href={site.resume} target="_blank" rel="noopener noreferrer">
        <FileText />
        Resume
      </a>
    </header>
  );
}
