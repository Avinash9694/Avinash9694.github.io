import { WORLD } from '../../lib/world';

const TOP = WORLD.deskTop;
const W = 2.9;
const D = 1.3;
const Z = -0.2;

export function Desk() {
  const legY = (TOP - 0.08) / 2;
  const legs: [number, number][] = [
    [-W / 2 + 0.12, Z - D / 2 + 0.12],
    [W / 2 - 0.12, Z - D / 2 + 0.12],
    [-W / 2 + 0.12, Z + D / 2 - 0.12],
    [W / 2 - 0.12, Z + D / 2 - 0.12],
  ];
  return (
    <group>
      <mesh position={[0, TOP - 0.04, Z]} castShadow receiveShadow>
        <boxGeometry args={[W, 0.08, D]} />
        <meshStandardMaterial color="#3b2c24" roughness={0.85} metalness={0} />
      </mesh>
      {legs.map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, legY, z]} castShadow>
          <boxGeometry args={[0.06, TOP - 0.08, 0.06]} />
          <meshStandardMaterial color="#161a22" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, TOP - 0.3, Z - D / 2 + 0.03]}>
        <boxGeometry args={[W - 0.3, 0.04, 0.04]} />
        <meshStandardMaterial color="#161a22" roughness={0.4} metalness={0.7} />
      </mesh>
    </group>
  );
}
