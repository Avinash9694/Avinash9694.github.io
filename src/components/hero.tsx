import { site } from '../data/site';
import { ArrowDownIcon, ArrowUpRightIcon, GitHubIcon, LinkedInIcon, MailIcon } from './icons';
import styles from './hero.module.css';

export function Hero() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.grid} />
        <div className={styles.grain} />
      </div>

      <div className={`${styles.inner} container`}>
        <p className={`${styles.status} mono`}>
          <span className={styles.statusDot} aria-hidden="true" />
          Currently: lead contributor on a Tauri + React cloud-ops desktop app
        </p>

        <h1 id="hero-title" className={styles.title}>
          {site.name}
        </h1>

        <p className={styles.role}>
          {site.title}
          <span className={styles.roleSep} aria-hidden="true">
            ·
          </span>
          <span className={styles.roleStack}>{site.tagline}</span>
        </p>

        <p className={styles.positioning}>
          I build web and desktop software that stays correct when the network, the third-party API
          or the user misbehaves. Four-plus years across React, TypeScript, Node.js and AWS — lately
          cloud-operations tooling with real security and reliability constraints.
        </p>

        <div className={styles.ctas}>
          <a href="#work" className={styles.primary}>
            View projects
            <ArrowDownIcon size={16} />
          </a>
          <a href={site.resume} className={styles.secondary} target="_blank" rel="noreferrer">
            Download resume
            <ArrowUpRightIcon size={16} />
          </a>
          <ul className={styles.social} aria-label="Profiles">
            <li>
              <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitHubIcon size={20} />
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedInIcon size={20} />
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} aria-label="Email">
                <MailIcon size={20} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
