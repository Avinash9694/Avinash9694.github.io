import { WORLD } from '../../lib/world';

const [x, y, z] = WORLD.lamp;

export function Lamp() {
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.012, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.025, 32]} />
        <meshStandardMaterial color="#161a22" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 1, 12]} />
        <meshStandardMaterial color="#161a22" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0.17, 1.03, 0.04]} rotation-z={-1.05} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.42, 12]} />
        <meshStandardMaterial color="#161a22" roughness={0.3} metalness={0.85} />
      </mesh>
      <group position={[0.32, 1.1, 0.08]} rotation-z={0.55}>
        <mesh castShadow>
          <coneGeometry args={[0.17, 0.24, 32, 1, true]} />
          <meshStandardMaterial color="#1a1e27" roughness={0.35} metalness={0.8} side={2} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#ffd9a0" emissive="#ffb45c" emissiveIntensity={7} />
        </mesh>
      </group>
    </group>
  );
}
