import { featuredProjects, gridProjects } from '../data/projects';
import { ProjectCard } from './project-card';
import { SectionHeading } from './section-heading';
import styles from './projects.module.css';

export function Projects() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className="container">
        <SectionHeading
          index="01"
          eyebrow="Selected work"
          id="work-title"
          title="Tools I built because I needed them"
          lede="Most of these started as a problem at work: an IAM policy I did not trust, an SSE stream that silently renamed an event, a Terraform diff too noisy to review. Each one is deployed, tested and open source."
        />

        <ul className={styles.featured} aria-label="Featured projects">
          {featuredProjects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              size="featured"
              delay={i * 80}
            />
          ))}
        </ul>

        <ul className={styles.grid} aria-label="More projects">
          {gridProjects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={featuredProjects.length + i}
              wide={i === gridProjects.length - 1}
              delay={(i % 3) * 80}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
