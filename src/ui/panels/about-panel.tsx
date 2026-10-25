import { intro, site } from '../../data/site';
import { FileText, GitHub, LinkedIn, Mail } from '../icons';
import styles from '../overlay.module.css';

export function AboutPanel() {
  return (
    <div className={`panel ${styles.card}`}>
      <img
        className={styles.photo}
        src={site.photo}
        alt={`Portrait of ${site.name}`}
        width={64}
        height={64}
      />
      <h2 className="eyebrow" id="about-title">
        About
      </h2>
      <p className={`display ${styles.title}`}>Hello.</p>
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
        <a href={site.resume} target="_blank" rel="noopener noreferrer">
          <FileText />
          Resume
        </a>
      </div>
    </div>
  );
}
