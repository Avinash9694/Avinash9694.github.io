import { WORLD } from '../../lib/world';

const TOP = WORLD.deskTop;

export function Mug() {
  return (
    <group position={[0.78, TOP, 0.18]}>
      <mesh position={[0, 0.065, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.062, 0.13, 32, 1, true]} />
        <meshStandardMaterial color="#e9e1d3" roughness={0.45} side={2} />
      </mesh>
      <mesh position={[0, 0.001, 0]}>
        <circleGeometry args={[0.062, 32]} />
        <meshStandardMaterial color="#e9e1d3" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.118, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.064, 32]} />
        <meshStandardMaterial color="#2b1a12" roughness={0.25} metalness={0.1} />
      </mesh>
      <mesh position={[0.085, 0.07, 0]} rotation-y={Math.PI / 2} castShadow>
        <torusGeometry args={[0.04, 0.011, 12, 32]} />
        <meshStandardMaterial color="#e9e1d3" roughness={0.45} />
      </mesh>
    </group>
  );
}
