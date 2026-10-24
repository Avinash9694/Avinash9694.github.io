import { site } from '../data/site';
import { PinIcon } from './icons';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import styles from './about.module.css';

export function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={`${styles.inner} container`}>
        <div>
          <SectionHeading index="04" eyebrow="About" id="about-title" title="Hi, I'm Avinash." />
          <Reveal className={styles.copy} delay={80}>
            <p>
              I'm a software developer based in Hyderabad with four-plus years across web and
              desktop applications. Right now I'm the lead contributor on a Tauri, React and Rust
              desktop app that scans AWS and Azure estates, surfaces findings and runs AI-assisted
              playbooks. Day to day that means secure authentication, rich-text editing, reliable
              telemetry and integrations with Jira, Linear and Slack.
            </p>
            <p>
              I like building things that stay correct when the network, the third-party API or the
              user misbehaves, and I care about the unglamorous parts: tests that catch the silent
              failure, error states that say what went wrong, and code the next person can read.
            </p>
            <p>
              I ranked first overall in a company-wide hackathon at Tessell, and I am happiest when
              a tool I built quietly saves someone an afternoon.
            </p>
          </Reveal>
        </div>

        <Reveal className={styles.aside} delay={140}>
          <div className={styles.photoFrame}>
            <img
              className={styles.photo}
              src="/avinash.png"
              alt="Avinash Sahu monogram"
              width={134}
              height={138}
            />
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>Based in</dt>
              <dd>
                <PinIcon size={14} />
                {site.location}
              </dd>
            </div>
            <div>
              <dt>Working on</dt>
              <dd>Cloud-ops desktop tooling</dd>
            </div>
            <div>
              <dt>Open to</dt>
              <dd>Senior frontend and full-stack roles</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
