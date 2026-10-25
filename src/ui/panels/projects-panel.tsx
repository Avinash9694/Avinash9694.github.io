import { PROJECT_COUNT, projects } from '../../data/projects';
import { activeProject } from '../../lib/progress-map';
import { goToProject } from '../../lib/scroll-controller';
import { useSceneStore } from '../../store/scene-store';
import { ArrowLeft, ArrowRight, ArrowUpRight, GitHub } from '../icons';
import styles from '../overlay.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

export function ProjectsPanel() {
  const active = useSceneStore((s) => activeProject(s.progress));
  const step = (delta: number) => goToProject((active + delta + PROJECT_COUNT) % PROJECT_COUNT);

  return (
    <div className={`panel ${styles.card}`}>
      <div className={styles.head}>
        <h2 className="eyebrow" id="projects-title">
          Projects
        </h2>
        <span className={styles.counter} aria-live="polite">
          {pad(active + 1)} / {pad(PROJECT_COUNT)}
        </span>
      </div>
      {projects.map((project, i) => (
        <div
          key={project.slug}
          role="tabpanel"
          id={`project-${i}`}
          aria-labelledby={`project-tab-${i}`}
          className={styles.pane}
          data-active={i === active}
          tabIndex={i === active ? 0 : -1}
          data-project-card={i}
          onFocus={() => i !== active && goToProject(i)}
        >
          <h3 className={`display ${styles.title}`}>{project.title}</h3>
          <p className={styles.summary}>{project.summary}</p>
          <ul className="tags" aria-label="Built with">
            {project.tags.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <a
              className="btn btn-primary btn-sm"
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live
              <ArrowUpRight />
            </a>
            <a
              className="btn btn-sm"
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub />
              Source
            </a>
          </div>
        </div>
      ))}
      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.step}
          aria-label="Previous project"
          onClick={() => step(-1)}
        >
          <ArrowLeft />
        </button>
        <div className={styles.dots} role="tablist" aria-label="Projects">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              role="tab"
              id={`project-tab-${i}`}
              className={styles.dot}
              aria-selected={i === active}
              aria-controls={`project-${i}`}
              aria-label={project.title}
              tabIndex={i === active ? 0 : -1}
              onClick={() => goToProject(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.step}
          aria-label="Next project"
          onClick={() => step(1)}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
