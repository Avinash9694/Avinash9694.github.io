import { formatRange, roleYear, roles } from '../data/experience';
import { projects } from '../data/projects';
import { SECTIONS, hackathon, intro, site } from '../data/site';
import { ArrowUpRight, FileText, GitHub, LinkedIn, Mail } from '../ui/icons';
import { CurrentYear } from '../ui/current-year';
import styles from './static-portfolio.module.css';

/** The whole portfolio as one static page: what low-tier devices, crawlers and no-JS get. */
export function StaticPortfolio() {
  return (
    <div className={styles.page} data-prerender="">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={styles.nav}>
        <a className={styles.brand} href="#hero">
          <span className={styles.dot} aria-hidden="true" />
          {site.name}
        </a>
        <nav className={styles.navLinks} aria-label="Sections">
          {SECTIONS.slice(1).map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>
      </header>
      <main id="main">
        <section id="hero" className={styles.hero} aria-label="Introduction">
          <h1 className={`display ${styles.name}`}>
            {site.firstName} <span>{site.lastName}</span>
          </h1>
          <p className={styles.subtitle}>
            {site.role} <span aria-hidden="true">&middot;</span> {site.location}
          </p>
          <p className={styles.stack}>{site.stack.join(' · ')}</p>
          <div className={styles.actions}>
            <a className="btn btn-primary" href="#projects">
              View work
            </a>
            <a className="btn" href={site.resume} target="_blank" rel="noopener noreferrer">
              <FileText />
              Resume
            </a>
          </div>
        </section>

        <section id="about" className={styles.section} aria-labelledby="about-title">
          <div className={styles.heading}>
            <h2 className="eyebrow" id="about-title">
              About
            </h2>
          </div>
          <div className={styles.about}>
            <img
              className={styles.photo}
              src={site.photo}
              alt={`Portrait of ${site.name}`}
              width={120}
              height={120}
            />
            <div>
              {intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className={styles.lead}>
                  {paragraph}
                </p>
              ))}
              <div className={styles.links}>
                <a href={`mailto:${site.email}`}>
                  <Mail />
                  {site.email}
                </a>
                <a href={site.github} target="_blank" rel="noopener noreferrer">
                  <GitHub />
                  GitHub
                </a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedIn />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className={styles.section} aria-labelledby="experience-title">
          <div className={styles.heading}>
            <h2 className="eyebrow" id="experience-title">
              Experience
            </h2>
            <p className={`display ${styles.title}`}>Four years, three teams</p>
          </div>
          <div>
            {[...roles].reverse().map((role, i) => (
              <article key={role.company} className={styles.role}>
                <p className={styles.year}>{roleYear(role)}</p>
                <div>
                  <h3 className={`display ${styles.roleTitle}`}>{role.company}</h3>
                  <p className={styles.meta}>
                    {role.title} <span aria-hidden="true">&middot;</span> {formatRange(role)}
                  </p>
                  <ul className={styles.bullets}>
                    {role.points.map((point) => (
                      <li key={point.slice(0, 32)}>{point}</li>
                    ))}
                  </ul>
                  {i === 0 && <p className={styles.hackathon}>{hackathon}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className={styles.section} aria-labelledby="projects-title">
          <div className={styles.heading}>
            <h2 className="eyebrow" id="projects-title">
              Projects
            </h2>
            <p className={`display ${styles.title}`}>Things I have built</p>
          </div>
          <ul className={styles.grid}>
            {projects.map((project) => (
              <li key={project.slug}>
                <article className={styles.card} aria-labelledby={`static-${project.slug}`}>
                  <img
                    src={project.screenshot}
                    alt={project.alt}
                    width={1200}
                    height={750}
                    loading="lazy"
                  />
                  <div className={styles.cardBody}>
                    <h3 className={`display ${styles.cardTitle}`} id={`static-${project.slug}`}>
                      {project.title}
                    </h3>
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
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className={styles.contact} aria-labelledby="contact-title">
          <h2 className="eyebrow" id="contact-title">
            Contact
          </h2>
          <p className={`display ${styles.hello}`}>Say hello</p>
          <a className="btn btn-primary" href={`mailto:${site.email}`}>
            <Mail />
            {site.email}
          </a>
          <div className={styles.links}>
            <a href={site.github} target="_blank" rel="noopener noreferrer">
              <GitHub />
              GitHub
            </a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedIn />
              LinkedIn
            </a>
            <a href={site.resume} target="_blank" rel="noopener noreferrer">
              <FileText />
              Resume
            </a>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <span>
          {site.name} <span aria-hidden="true">&middot;</span> <CurrentYear />
        </span>
        <a href={site.source} target="_blank" rel="noopener noreferrer">
          Source
        </a>
      </footer>
    </div>
  );
}
