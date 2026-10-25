import { WORLD } from '../../lib/world';

const TOP = WORLD.deskTop;
const LEAVES: { rot: number; tilt: number; len: number; color: string }[] = [
  { rot: 0.2, tilt: 0.9, len: 0.24, color: '#3d8f5b' },
  { rot: 1.3, tilt: 1.0, len: 0.2, color: '#2f7b4a' },
  { rot: 2.4, tilt: 0.8, len: 0.26, color: '#46a066' },
  { rot: 3.6, tilt: 1.05, len: 0.21, color: '#2f7b4a' },
  { rot: 4.7, tilt: 0.85, len: 0.23, color: '#3d8f5b' },
  { rot: 5.6, tilt: 1.1, len: 0.19, color: '#56ad74' },
];

export function Plant() {
  return (
    <group position={[1.12, TOP, -0.52]}>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.1, 0.2, 24]} />
        <meshStandardMaterial color="#8c5a3c" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.115, 0.115, 0.02, 24]} />
        <meshStandardMaterial color="#2a1d14" roughness={1} />
      </mesh>
      {LEAVES.map((leaf) => (
        <group key={leaf.rot} position={[0, 0.22, 0]} rotation-y={leaf.rot}>
          <mesh position={[leaf.len * 0.5, leaf.len * 0.55, 0]} rotation-z={leaf.tilt} castShadow>
            <sphereGeometry args={[leaf.len * 0.5, 12, 12]} />
            <meshStandardMaterial color={leaf.color} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
