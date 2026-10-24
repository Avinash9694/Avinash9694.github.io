import { site } from '../data/site';
import { ArrowUpRightIcon, GitHubIcon, LinkedInIcon, MailIcon } from './icons';
import { Reveal } from './reveal';
import styles from './footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className={styles.footer} aria-labelledby="contact-title">
      <div className="container">
        <Reveal className={styles.cta}>
          <p className={`${styles.eyebrow} mono`}>
            <span className={styles.index}>05</span>
            <span aria-hidden="true" className={styles.rule} />
            Contact
          </p>
          <h2 id="contact-title" className={styles.title}>
            Let's build something that holds up.
          </h2>
          <p className={styles.lede}>
            I'm open to senior frontend and full-stack roles, and happy to talk about cloud tooling,
            desktop apps or anything in the projects above. Email is best.
          </p>
          <a href={`mailto:${site.email}`} className={`${styles.email} mono`}>
            {site.email}
            <ArrowUpRightIcon size={20} />
          </a>
          <ul className={styles.links} aria-label="Elsewhere">
            <li>
              <a href={site.github} target="_blank" rel="noreferrer">
                <GitHubIcon size={16} />
                GitHub
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                <LinkedInIcon size={16} />
                LinkedIn
              </a>
            </li>
            <li>
              <a href={site.resume} target="_blank" rel="noreferrer">
                <MailIcon size={16} />
                Resume (PDF)
              </a>
            </li>
          </ul>
        </Reveal>

        <div className={styles.bottom}>
          <p className={styles.built}>
            Built by{' '}
            <a href={site.url} className={styles.builtLink}>
              Avinash Sahu
            </a>
            <span className={styles.sep} aria-hidden="true">
              ·
            </span>
            Built with React + TypeScript, deployed on GitHub Pages
            <span className={styles.sep} aria-hidden="true">
              ·
            </span>
            <span className="mono">{year}</span>
          </p>
          <ul className={styles.icons} aria-label="Profiles">
            <li>
              <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitHubIcon size={18} />
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedInIcon size={18} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
