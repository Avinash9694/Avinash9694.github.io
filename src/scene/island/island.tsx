import { MeshReflectorMaterial } from '@react-three/drei';
import type { Tier } from '../../lib/device-tier';
import { WORLD } from '../../lib/world';
import { Desk } from './desk';
import { Monitor } from './monitor';
import { Keyboard } from './keyboard';
import { Lamp } from './lamp';
import { Plant } from './plant';
import { Mug } from './mug';
import { Books } from './books';

const R = WORLD.islandRadius;

/** A floating disc of rock with a mirror-dark top, carrying the desk and everything on it. */
export function Island({ tier }: { tier: Tier }) {
  const high = tier === 'high';
  return (
    <group>
      <mesh position={[0, -0.32, 0]} receiveShadow>
        <cylinderGeometry args={[R, R * 0.9, 0.64, 72]} />
        <meshStandardMaterial color="#0c1018" roughness={0.92} metalness={0.08} />
      </mesh>
      <mesh position={[0, -1.9, 0]} rotation-x={Math.PI}>
        <coneGeometry args={[R * 0.82, 2.6, 48, 1, true]} />
        <meshStandardMaterial color="#070a11" roughness={1} metalness={0} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0]} receiveShadow>
        <circleGeometry args={[R, 96]} />
        <MeshReflectorMaterial
          blur={high ? [360, 120] : [0, 0]}
          resolution={high ? 1024 : 512}
          mixBlur={high ? 1 : 0}
          mixStrength={high ? 9 : 6}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#080b13"
          metalness={0.55}
          mirror={0.4}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.006, 0]}>
        <ringGeometry args={[R - 0.035, R, 128]} />
        <meshBasicMaterial color={[0.35, 1.7, 2.4]} toneMapped={false} />
      </mesh>
      <Desk />
      <Monitor />
      <Keyboard />
      <Lamp />
      <Plant />
      <Mug />
      <Books />
    </group>
  );
}
