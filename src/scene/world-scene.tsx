import { Stars } from '@react-three/drei';
import { Suspense, lazy } from 'react';
import type { Tier } from '../lib/device-tier';
import { Dust } from './dust';
import { Island } from './island/island';
import { Lighting } from './lighting';
import { NameLetters } from './name-letters';
import { Timeline } from './timeline';

const ProjectFrames = lazy(() => import('./project-frames'));

export function WorldScene({ tier }: { tier: Tier }) {
  return (
    <>
      <Stars
        radius={70}
        depth={40}
        count={tier === 'high' ? 2600 : 1200}
        factor={3.2}
        saturation={0.15}
        fade
        speed={0.3}
      />
      <Lighting tier={tier} />
      <Island tier={tier} />
      <NameLetters />
      <Timeline />
      <Dust count={tier === 'high' ? 1400 : 500} />
      <Suspense fallback={null}>
        <ProjectFrames />
      </Suspense>
    </>
  );
}
