import { WORLD } from '../../lib/world';

const TOP = WORLD.deskTop;

export function Books() {
  return (
    <group position={[-1.02, TOP, 0.14]} rotation-y={0.18}>
      <mesh position={[0, 0.018, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.036, 0.22]} />
        <meshStandardMaterial color="#7a2e2a" roughness={0.7} />
      </mesh>
      <mesh position={[0.02, 0.052, -0.01]} rotation-y={-0.12} castShadow receiveShadow>
        <boxGeometry args={[0.27, 0.03, 0.2]} />
        <meshStandardMaterial color="#1f3a63" roughness={0.7} />
      </mesh>
      <mesh position={[-0.01, 0.08, 0.01]} rotation-y={0.08} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.026, 0.19]} />
        <meshStandardMaterial color="#c99a4a" roughness={0.65} />
      </mesh>
    </group>
  );
}
