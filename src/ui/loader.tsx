import { useEffect, useState } from 'react';
import { site } from '../data/site';
import { useSceneStore } from '../store/scene-store';
import styles from './loader.module.css';

export function Loader() {
  const ready = useSceneStore((s) => s.ready);
  const progress = useSceneStore((s) => s.loadProgress);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => setGone(true), 800);
    return () => window.clearTimeout(id);
  }, [ready]);

  if (gone) return null;
  const shown = ready ? 100 : Math.round(progress);
  return (
    <div
      className={`${styles.loader} ${ready ? styles.done : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.inner}>
        <div className={`display ${styles.name}`}>
          {site.firstName} <span>{site.lastName}</span>
        </div>
        <div className={styles.bar} aria-hidden="true">
          <div className={styles.fill} style={{ width: `${shown}%` }} />
        </div>
        <div className={styles.meta}>
          <span>Building the scene</span>
          <span>{shown}%</span>
        </div>
      </div>
    </div>
  );
}
