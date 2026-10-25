import { site } from '../../data/site';
import { CurrentYear } from '../current-year';
import { FileText, GitHub, LinkedIn, Mail } from '../icons';
import styles from '../overlay.module.css';

export function ContactPanel() {
  return (
    <>
      <div className={`panel ${styles.card}`}>
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
      </div>
      <footer className={styles.footer}>
        <span>
          {site.name} <span aria-hidden="true">&middot;</span> <CurrentYear />
        </span>
        <a href={site.source} target="_blank" rel="noopener noreferrer">
          Source
        </a>
      </footer>
    </>
  );
}
