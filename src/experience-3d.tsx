import { Suspense, lazy, useEffect, useRef } from 'react';
import { installPointerTracking } from './lib/pointer';
import { installScroll } from './lib/scroll-controller';
import { Loader } from './ui/loader';
import { Overlay } from './ui/overlay';
import { PerfBadge } from './ui/perf-badge';
import { ProgressRail } from './ui/progress-rail';
import { ScrollHint } from './ui/scroll-hint';
import { TopBar } from './ui/top-bar';
import { useKeyboardNav } from './ui/use-keyboard-nav';
import styles from './experience-3d.module.css';

const SceneCanvas = lazy(() => import('./scene/scene-canvas'));

/** The 3D site: a fixed canvas, fixed overlays, and a tall spacer that owns the scroll. */
export default function Experience3D() {
  const spacer = useRef<HTMLDivElement>(null);
  useKeyboardNav();

  useEffect(() => installPointerTracking(), []);
  useEffect(() => {
    if (!spacer.current) return;
    return installScroll(spacer.current);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Loader />
      <Suspense fallback={null}>
        <SceneCanvas />
      </Suspense>
      <TopBar />
      <ProgressRail />
      <Overlay />
      <ScrollHint />
      {import.meta.env.DEV && <PerfBadge />}
      <div ref={spacer} className={styles.spacer} aria-hidden="true" />
    </>
  );
}
