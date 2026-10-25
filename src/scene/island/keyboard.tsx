import { RoundedBox } from '@react-three/drei';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Object3D, type InstancedMesh } from 'three';
import { WORLD } from '../../lib/world';

const TOP = WORLD.deskTop;
const ROWS = 5;
const COLS = 13;
const PITCH = 0.068;
const Z = 0.16;

export function Keyboard() {
  const keys = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useLayoutEffect(() => {
    const mesh = keys.current;
    if (!mesh) return;
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const bottomRow = r === ROWS - 1;
        if (bottomRow && c >= 4 && c <= 8 && c !== 6) continue;
        const stagger = (r % 2) * PITCH * 0.3;
        dummy.position.set(
          (c - (COLS - 1) / 2) * PITCH + stagger,
          TOP + 0.045,
          Z + (r - (ROWS - 1) / 2) * PITCH,
        );
        dummy.scale.set(bottomRow && c === 6 ? 5 : 1, 1, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i++, dummy.matrix);
      }
    }
    mesh.count = i;
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <group>
      <RoundedBox
        args={[0.98, 0.035, 0.38]}
        radius={0.012}
        smoothness={3}
        position={[0, TOP + 0.018, Z]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#1b2030" roughness={0.45} metalness={0.5} />
      </RoundedBox>
      <mesh rotation-x={-Math.PI / 2} position={[0, TOP + 0.0365, Z]}>
        <planeGeometry args={[0.93, 0.34]} />
        <meshBasicMaterial color="#2a7fa8" toneMapped={false} />
      </mesh>
      <instancedMesh ref={keys} args={[undefined, undefined, ROWS * COLS]} castShadow receiveShadow>
        <boxGeometry args={[0.054, 0.022, 0.054]} />
        <meshStandardMaterial color="#232a3a" roughness={0.5} metalness={0.2} />
      </instancedMesh>
      <RoundedBox
        args={[0.075, 0.03, 0.12]}
        radius={0.012}
        smoothness={3}
        position={[0.68, TOP + 0.015, Z + 0.04]}
        castShadow
      >
        <meshStandardMaterial color="#1b2030" roughness={0.4} metalness={0.5} />
      </RoundedBox>
    </group>
  );
}
