import { Environment, Lightformer } from '@react-three/drei';
import { useMemo } from 'react';
import { Object3D } from 'three';
import { WORLD } from '../lib/world';
import type { Tier } from '../lib/device-tier';

const [lx, ly, lz] = WORLD.lamp;

export function Lighting({ tier }: { tier: Tier }) {
  const deskTarget = useMemo(() => {
    const target = new Object3D();
    target.position.set(0.2, WORLD.deskTop, -0.1);
    return target;
  }, []);
  const shadowSize = tier === 'high' ? 1024 : 512;

  return (
    <>
      <hemisphereLight args={['#22304d', '#04050a', 0.55]} />
      <primitive object={deskTarget} />
      <spotLight
        position={[lx + 0.3, ly + 1.12, lz + 0.08]}
        target={deskTarget}
        angle={0.78}
        penumbra={0.75}
        intensity={70}
        distance={14}
        decay={2}
        color="#ffb45c"
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-5, 3.5, -9]} intensity={1.5} color="#5fd6ff" />
      <directionalLight position={[4, 5, 8]} intensity={0.9} color="#ffd6a3" />
      <pointLight
        position={[3.2, 2.6, 2.4]}
        intensity={9}
        distance={12}
        decay={2}
        color="#ffd6a3"
      />
      <pointLight
        position={[-7.5, 3.5, 9]}
        intensity={14}
        distance={16}
        decay={2}
        color="#3ec8ff"
      />
      <pointLight position={[8, 3.5, 2]} intensity={18} distance={18} decay={2} color="#ffb45c" />
      <Environment resolution={tier === 'high' ? 256 : 128} frames={1}>
        <color attach="background" args={['#0a0d16']} />
        <Lightformer
          form="rect"
          intensity={6}
          color="#ffc07a"
          position={[0, 6, -1]}
          rotation-x={Math.PI / 2}
          scale={[10, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          color="#ffe3bd"
          position={[0, 2.5, 9]}
          rotation-y={Math.PI}
          scale={[9, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color="#5fd6ff"
          position={[0, 3, -9]}
          scale={[9, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color="#5fd6ff"
          position={[-8, 3, -5]}
          rotation-y={Math.PI / 2}
          scale={[8, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.5}
          color="#5fd6ff"
          position={[8, 2, 3]}
          rotation-y={-Math.PI / 2}
          scale={[6, 3, 1]}
        />
        <Lightformer form="circle" intensity={2} color="#ffffff" position={[2, 4, 8]} scale={3} />
      </Environment>
    </>
  );
}
