import { Billboard, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { damp, damp3 } from 'maath/easing';
import { useMemo, useRef } from 'react';
import {
  CatmullRomCurve3,
  Color,
  TubeGeometry,
  Vector3,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  type PointLight,
} from 'three';
import { formatRange, roles, roleYear } from '../data/experience';
import {
  EXPERIENCE_SECTION,
  ROLE_STATIONS,
  sectionFromProgress,
  stationDistance,
} from '../lib/progress-map';
import { TIMELINE_NODES, timelinePath } from '../lib/world';
import { useSceneStore } from '../store/scene-store';
import { DISPLAY_FONT_URL, MONO_FONT_URL } from './fonts';

const AMBER = new Color('#ffb45c');
const CYAN = new Color('#3ec8ff');

interface NodeRefs {
  core: MeshStandardMaterial | null;
  ringA: Mesh | null;
  ringB: Mesh | null;
  label: Group | null;
}

/** Three glowing stops on a luminous tube, one per role, oldest furthest away. */
export function Timeline() {
  const tube = useMemo(() => {
    const curve = new CatmullRomCurve3(
      timelinePath().map((p) => new Vector3(...p)),
      false,
      'centripetal',
    );
    return new TubeGeometry(curve, 140, 0.028, 10, false);
  }, []);
  const nodes = useRef<NodeRefs[]>(
    roles.map(() => ({ core: null, ringA: null, ringB: null, label: null })),
  );
  const glow = useRef<PointLight>(null);
  const glowTarget = useMemo(() => new Vector3(), []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const progress = useSceneStore.getState().progress;
    const inSection = sectionFromProgress(progress) === EXPERIENCE_SECTION;
    const t = state.clock.elapsedTime;
    let brightest = 0;
    let brightestEmphasis = -1;
    nodes.current.forEach((refs, i) => {
      const emphasis = Math.max(0, 1 - stationDistance(ROLE_STATIONS, i, progress));
      if (emphasis > brightestEmphasis) {
        brightestEmphasis = emphasis;
        brightest = i;
      }
      if (refs.core) {
        refs.core.emissive.lerpColors(CYAN, AMBER, emphasis);
        damp(refs.core, 'emissiveIntensity', 0.9 + emphasis * 1.6, 0.3, delta);
      }
      if (refs.ringA) {
        refs.ringA.rotation.z = t * 0.35 + i;
        refs.ringA.rotation.x = Math.PI / 2 + Math.sin(t * 0.4 + i) * 0.25;
      }
      if (refs.ringB) {
        refs.ringB.rotation.y = -t * 0.25 + i;
        refs.ringB.rotation.x = 0.9 + Math.cos(t * 0.3 + i) * 0.2;
      }
      if (refs.label) {
        const labelScale = inSection ? 0.4 + emphasis * 0.6 : 0.0001;
        damp3(refs.label.scale, [labelScale, labelScale, labelScale], 0.35, delta);
      }
    });
    if (glow.current) {
      const node = TIMELINE_NODES[brightest] ?? [0, 0, 0];
      glowTarget.set(node[0], node[1] + 0.4, node[2] + 0.6);
      damp3(glow.current.position, glowTarget, 0.4, delta);
    }
  });

  return (
    <group>
      <mesh geometry={tube}>
        <meshStandardMaterial
          color="#0a2634"
          emissive="#2fb6e8"
          emissiveIntensity={1.7}
          roughness={0.4}
        />
      </mesh>
      <pointLight ref={glow} intensity={10} distance={7} decay={2} color="#ffb45c" />
      {roles.map((role, i) => {
        const [x, y, z] = TIMELINE_NODES[i] ?? [0, 0, 0];
        const set =
          <K extends keyof NodeRefs>(key: K) =>
          (value: NodeRefs[K]) => {
            const refs = nodes.current[i];
            if (refs) refs[key] = value;
          };
        return (
          <group key={role.company} position={[x, y, z]}>
            <mesh castShadow>
              <sphereGeometry args={[0.24, 32, 32]} />
              <meshStandardMaterial
                ref={set('core')}
                color="#06080f"
                emissive="#3ec8ff"
                emissiveIntensity={1}
                roughness={0.25}
                metalness={0.2}
              />
            </mesh>
            <mesh ref={set('ringA')}>
              <torusGeometry args={[0.44, 0.012, 12, 72]} />
              <meshStandardMaterial
                color="#9ad9ff"
                emissive="#5fd6ff"
                emissiveIntensity={1.4}
                roughness={0.3}
                metalness={0.6}
              />
            </mesh>
            <mesh ref={set('ringB')}>
              <torusGeometry args={[0.6, 0.008, 12, 72]} />
              <meshStandardMaterial
                color="#ffd9a0"
                emissive="#ffb45c"
                emissiveIntensity={1.1}
                roughness={0.3}
                metalness={0.6}
              />
            </mesh>
            <Billboard position={[0, 0.95, 0]} follow>
              <group ref={set('label')}>
                <Text
                  font={MONO_FONT_URL}
                  fontSize={0.11}
                  color="#ffb45c"
                  anchorX="center"
                  anchorY="bottom"
                  position={[0, 0.3, 0]}
                >
                  {roleYear(role)}
                </Text>
                <Text
                  font={DISPLAY_FONT_URL}
                  fontSize={0.24}
                  color="#f3e6cf"
                  anchorX="center"
                  anchorY="bottom"
                  position={[0, 0, 0]}
                >
                  {role.company}
                </Text>
                <Text
                  font={MONO_FONT_URL}
                  fontSize={0.095}
                  color="#9fb0cc"
                  anchorX="center"
                  anchorY="top"
                  position={[0, -0.08, 0]}
                >
                  {formatRange(role)}
                </Text>
              </group>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}
