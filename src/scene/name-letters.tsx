import { Center, Text3D } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { damp, damp3 } from 'maath/easing';
import { useRef } from 'react';
import type { Group } from 'three';
import { pointer } from '../lib/pointer';
import { sectionFromProgress } from '../lib/progress-map';
import { useSceneStore } from '../store/scene-store';
import { WORLD } from '../lib/world';
import { site } from '../data/site';
import { TYPEFACE_URL } from './fonts';

function LetterMaterial() {
  return (
    <meshPhysicalMaterial
      color="#e9c98f"
      metalness={0.78}
      roughness={0.3}
      clearcoat={1}
      clearcoatRoughness={0.12}
      iridescence={0.55}
      iridescenceIOR={1.5}
      iridescenceThicknessRange={[160, 480]}
      envMapIntensity={2.1}
    />
  );
}

const TEXT_PROPS = {
  font: TYPEFACE_URL,
  size: 0.8,
  height: 0.3,
  bevelEnabled: true,
  bevelThickness: 0.035,
  bevelSize: 0.022,
  bevelSegments: 5,
  curveSegments: 10,
  letterSpacing: 0.03,
  castShadow: true,
} as const;

/** The name as two lines of extruded, iridescent letters floating over the desk. */
export function NameLetters() {
  const group = useRef<Group>(null);
  const aspect = useThree((s) => s.viewport.aspect);
  const scale = Math.min(1, Math.max(0.5, aspect / 1.55));

  useFrame((state, rawDelta) => {
    const g = group.current;
    if (!g) return;
    const delta = Math.min(rawDelta, 0.1);
    const t = state.clock.elapsedTime;
    const px = pointer.active ? pointer.x : 0;
    const py = pointer.active ? pointer.y : 0;
    damp(g.rotation, 'y', px * 0.22, 0.5, delta);
    damp(g.rotation, 'x', -py * 0.1, 0.5, delta);
    g.position.y = WORLD.nameCenter[1] + Math.sin(t * 0.6) * 0.06;
    // Close-ups would only catch a cut-off slab of a letter, so the name steps aside.
    const section = sectionFromProgress(useSceneStore.getState().progress);
    const shown = section === 0 || section === 4 ? scale : 0.0001;
    damp3(g.scale, [shown, shown, shown], 0.35, delta);
  });

  return (
    <group ref={group} position={[...WORLD.nameCenter]} scale={scale}>
      <Center position={[0, 0.54, 0]}>
        <Text3D {...TEXT_PROPS}>
          {site.firstName.toUpperCase()}
          <LetterMaterial />
        </Text3D>
      </Center>
      <Center position={[0, -0.54, 0]}>
        <Text3D {...TEXT_PROPS}>
          {site.lastName.toUpperCase()}
          <LetterMaterial />
        </Text3D>
      </Center>
    </group>
  );
}
