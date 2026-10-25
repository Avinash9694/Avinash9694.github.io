import type { Project } from '../data/projects';
import { ArrowUpRightIcon, CodeIcon } from './icons';
import { ProjectCover } from './project-cover';
import { Reveal } from './reveal';
import styles from './project-card.module.css';

interface ProjectCardProps {
  project: Project;
  index: number;
  size?: 'featured' | 'default';
  /** When this is the grid's last card, let it span a row that would otherwise leave it alone. */
  wide?: boolean;
  delay?: number;
}

export function ProjectCard({
  project,
  index,
  size = 'default',
  wide = false,
  delay = 0,
}: ProjectCardProps) {
  const primaryHref = project.live ?? project.source;
  const className = [styles.card, size === 'featured' && styles.featured, wide && styles.wide]
    .filter(Boolean)
    .join(' ');

  return (
    <Reveal as="li" className={className} delay={delay}>
      <article className={styles.article} aria-labelledby={`${project.slug}-title`}>
        <a
          href={primaryHref}
          className={styles.coverLink}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          aria-hidden="true"
        >
          <ProjectCover project={project} index={index} />
        </a>

        <div className={styles.body}>
          <div className={styles.head}>
            <h3 id={`${project.slug}-title`} className={styles.title}>
              <a href={primaryHref} target="_blank" rel="noreferrer">
                {project.title}
              </a>
            </h3>
            {project.live === null ? (
              <span className={`${styles.badge} mono`}>Source only</span>
            ) : null}
          </div>
          <p className={styles.tagline}>{project.tagline}</p>
          <p className={styles.description}>{project.description}</p>

          <ul className={styles.tags} aria-label="Technologies">
            {project.tags.map((tag) => (
              <li key={tag} className={`${styles.tag} mono`}>
                {tag}
              </li>
            ))}
          </ul>

          <div className={styles.links}>
            {project.live ? (
              <a href={project.live} className={styles.link} target="_blank" rel="noreferrer">
                Live
                <ArrowUpRightIcon size={15} />
                <span className="sr-only"> — {project.title} (opens in a new tab)</span>
              </a>
            ) : null}
            <a href={project.source} className={styles.link} target="_blank" rel="noreferrer">
              Source
              <CodeIcon size={15} />
              <span className="sr-only"> — {project.title} on GitHub (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
