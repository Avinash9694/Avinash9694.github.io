import { lazy, Suspense, useEffect, useState } from 'react';
import { shouldRender3D } from '../../lib/render-3d';
import { readDeviceSignals } from './device-signals';
import type { GraphSceneProps } from './types';

// three.js and the scene load only once we know this device should get them.
const GraphScene = lazy(() => import('./graph-scene'));

export default function GraphIsland(props: GraphSceneProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const decide = () => setEnabled(shouldRender3D(readDeviceSignals()));
    decide();
    motion.addEventListener('change', decide);
    return () => motion.removeEventListener('change', decide);
  }, []);

  // The wrapper is also what client:visible watches; an island that renders
  // nothing has no element to observe and would never hydrate.
  return (
    <div className="graph-gate">
      {enabled && (
        <Suspense fallback={null}>
          <GraphScene {...props} />
        </Suspense>
      )}
    </div>
  );
}
