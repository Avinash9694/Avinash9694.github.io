import type { ReactNode } from 'react';
import { Reveal } from './reveal';
import styles from './section-heading.module.css';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  id: string;
}

export function SectionHeading({ index, eyebrow, title, lede, id }: SectionHeadingProps) {
  return (
    <Reveal className={styles.heading}>
      <p className={`${styles.eyebrow} mono`}>
        <span className={styles.index}>{index}</span>
        <span aria-hidden="true" className={styles.rule} />
        <span>{eyebrow}</span>
      </p>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </Reveal>
  );
}
