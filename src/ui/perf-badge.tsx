import { useEffect, useState } from 'react';
import { useSceneStore } from '../store/scene-store';

/** Dev only: tier and a rolling FPS figure in the bottom-left corner. */
export function PerfBadge() {
  const tier = useSceneStore((s) => s.tier);
  const progress = useSceneStore((s) => s.progress);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      frames += 1;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: 12,
        bottom: 12,
        zIndex: 30,
        padding: '6px 10px',
        borderRadius: 8,
        background: 'var(--panel-strong)',
        border: '1px solid var(--line)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-2)',
      }}
    >
      {tier} / {fps} fps / {progress.toFixed(3)}
    </div>
  );
}
