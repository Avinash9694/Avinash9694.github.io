import { useSceneStore } from '../store/scene-store';
import styles from './scroll-hint.module.css';

export function ScrollHint() {
  const hasScrolled = useSceneStore((s) => s.hasScrolled);
  const ready = useSceneStore((s) => s.ready);
  return (
    <div
      className={`${styles.hint} ${hasScrolled || !ready ? styles.hidden : ''}`}
      aria-hidden="true"
    >
      <span>Scroll</span>
      <span className={styles.track} />
    </div>
  );
}
