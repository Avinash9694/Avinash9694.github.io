import { RenderTexture, RoundedBox } from '@react-three/drei';
import { WORLD } from '../../lib/world';
import { MonitorScreen } from './monitor-screen';

const [sx, sy, sz] = WORLD.monitorScreen;
const TOP = WORLD.deskTop;

export function Monitor() {
  return (
    <group>
      <mesh position={[sx, TOP + 0.015, sz]} castShadow>
        <cylinderGeometry args={[0.24, 0.26, 0.03, 32]} />
        <meshStandardMaterial color="#161a22" roughness={0.35} metalness={0.8} />
      </mesh>
      <mesh position={[sx, TOP + 0.16, sz - 0.02]} castShadow>
        <boxGeometry args={[0.09, 0.26, 0.05]} />
        <meshStandardMaterial color="#161a22" roughness={0.35} metalness={0.8} />
      </mesh>
      <RoundedBox
        args={[1.3, 0.78, 0.05]}
        radius={0.02}
        smoothness={4}
        position={[sx, sy, sz - 0.02]}
        castShadow
      >
        <meshStandardMaterial color="#0f1219" roughness={0.3} metalness={0.6} />
      </RoundedBox>
      <mesh position={[sx, sy, sz + 0.0055]}>
        <planeGeometry args={[1.21, 0.68]} />
        <meshBasicMaterial toneMapped={false}>
          <RenderTexture attach="map" width={640} height={360} anisotropy={4}>
            <MonitorScreen />
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
      <pointLight
        position={[sx, sy, sz + 0.5]}
        intensity={1.6}
        distance={2.4}
        decay={2}
        color="#8fd9ff"
      />
    </group>
  );
}
