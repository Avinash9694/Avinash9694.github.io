import { site } from '../../data/site';
import { goToSection } from '../../lib/scroll-controller';
import { FileText } from '../icons';
import styles from '../overlay.module.css';

export function HeroPanel() {
  return (
    <div className={styles.card}>
      <h1 className="sr-only">{site.name}</h1>
      <p className={styles.subtitle}>
        {site.role} <span aria-hidden="true">&middot;</span> {site.location}
      </p>
      <p className={styles.stack}>{site.stack.join(' · ')}</p>
      <div className={styles.actions}>
        <button type="button" className="btn btn-primary" onClick={() => goToSection(3)}>
          View work
        </button>
        <a className="btn" href={site.resume} target="_blank" rel="noopener noreferrer">
          <FileText />
          Resume
        </a>
      </div>
    </div>
  );
}
