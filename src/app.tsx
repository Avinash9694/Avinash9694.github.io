import { Suspense, lazy } from 'react';
import type { Tier } from './lib/device-tier';
import { StaticPortfolio } from './static/static-portfolio';
import { Loader } from './ui/loader';

const Experience3D = lazy(() => import('./experience-3d'));

/** The 3D shell is a separate chunk, so the static tier never downloads three.js. */
export function App({ tier }: { tier: Tier }) {
  if (tier === 'low') return <StaticPortfolio />;
  return (
    <Suspense fallback={<Loader />}>
      <Experience3D />
    </Suspense>
  );
}
