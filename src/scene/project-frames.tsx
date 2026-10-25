import { RoundedBox, useCursor, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { damp, damp3, dampQ } from 'maath/easing';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Color,
  Object3D,
  SRGBColorSpace,
  Vector3,
  type Group,
  type MeshStandardMaterial,
} from 'three';
import { projects } from '../data/projects';
import { openProject } from '../lib/open-project';
import { pointer } from '../lib/pointer';
import { PROJECTS_SECTION, activeProject, sectionFromProgress } from '../lib/progress-map';
import { goToProject } from '../lib/scroll-controller';
import { FRAME_SLOTS } from '../lib/world';
import { useSceneStore } from '../store/scene-store';

const AMBER = new Color('#ffb45c');
const CYAN = new Color('#2fb6e8');
const UP = new Vector3(0, 1, 0);
const FRAME_W = 1.56;
const FRAME_H = 0.975;

interface FrameRefs {
  group: Group | null;
  edge: MeshStandardMaterial | null;
}

/** Nine screenshot frames on a helix; the one nearest the camera eases up in front of it. */
export default function ProjectFrames() {
  const textures = useTexture(projects.map((p) => p.screenshot));
  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = 4;
    });
  }, [textures]);

  const refs = useRef<FrameRefs[]>(projects.map(() => ({ group: null, edge: null })));
  const [hovered, setHovered] = useState<number | null>(null);
  useCursor(hovered !== null);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const v = useMemo(
    () => ({
      forward: new Vector3(),
      right: new Vector3(),
      up: new Vector3(),
      target: new Vector3(),
      dummy: new Object3D(),
    }),
    [],
  );

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const progress = useSceneStore.getState().progress;
    const inProjects = sectionFromProgress(progress) === PROJECTS_SECTION;
    const active = activeProject(progress);
    const t = state.clock.elapsedTime;
    const wide = size.width / size.height > 1.1;

    camera.getWorldDirection(v.forward);
    v.right.crossVectors(v.forward, UP).normalize();
    v.up.crossVectors(v.right, v.forward);

    refs.current.forEach((frame, i) => {
      const g = frame.group;
      const slot = FRAME_SLOTS[i];
      if (!g || !slot) return;
      const isHero = inProjects && i === active;
      if (isHero) {
        v.target
          .copy(camera.position)
          .addScaledVector(v.forward, 3.9)
          .addScaledVector(v.right, wide ? 1.05 : 0)
          .addScaledVector(v.up, wide ? 0.05 : 0.6);
        damp3(g.position, v.target, 0.32, delta);
        v.dummy.position.copy(g.position);
        v.dummy.lookAt(camera.position);
        const px = pointer.active ? pointer.x : 0;
        const py = pointer.active ? pointer.y : 0;
        v.dummy.rotateY(-px * 0.28);
        v.dummy.rotateX(py * 0.18);
        dampQ(g.quaternion, v.dummy.quaternion, 0.3, delta);
      } else {
        v.target.set(
          slot.position[0],
          slot.position[1] + Math.sin(t * 0.7 + i * 1.3) * 0.08,
          slot.position[2],
        );
        damp3(g.position, v.target, 0.5, delta);
        v.dummy.position.copy(g.position);
        v.dummy.lookAt(slot.facing[0], slot.facing[1], slot.facing[2]);
        dampQ(g.quaternion, v.dummy.quaternion, 0.5, delta);
      }
      const shown = inProjects ? 1 : 0.0001;
      const scale = (isHero ? (wide ? 1.08 : 0.9) : hovered === i ? 1.04 : 1) * shown;
      damp3(g.scale, [scale, scale, scale], inProjects ? 0.3 : 0.5, delta);
      if (frame.edge) {
        frame.edge.emissive.lerpColors(CYAN, AMBER, isHero ? 1 : 0);
        damp(
          frame.edge,
          'emissiveIntensity',
          isHero ? 0.75 : hovered === i ? 0.7 : 0.35,
          0.3,
          delta,
        );
      }
    });
  });

  return (
    <group>
      {projects.map((project, i) => {
        const slot = FRAME_SLOTS[i];
        const texture = textures[i];
        if (!slot || !texture) return null;
        return (
          <group
            key={project.slug}
            position={[...slot.position]}
            ref={(g) => {
              const frame = refs.current[i];
              if (frame) frame.group = g;
            }}
            onClick={(event) => {
              event.stopPropagation();
              const progress = useSceneStore.getState().progress;
              if (
                sectionFromProgress(progress) === PROJECTS_SECTION &&
                activeProject(progress) === i
              ) {
                openProject(i);
              } else {
                goToProject(i);
              }
            }}
            onPointerOver={(event) => {
              event.stopPropagation();
              setHovered(i);
            }}
            onPointerOut={() => setHovered((h) => (h === i ? null : h))}
          >
            <RoundedBox args={[FRAME_W, FRAME_H, 0.06]} radius={0.035} smoothness={4} castShadow>
              <meshStandardMaterial
                ref={(m) => {
                  const frame = refs.current[i];
                  if (frame) frame.edge = m;
                }}
                color="#0d1119"
                roughness={0.3}
                metalness={0.7}
                emissive="#2fb6e8"
                emissiveIntensity={0.4}
              />
            </RoundedBox>
            <mesh position={[0, 0, 0.0315]}>
              <planeGeometry args={[1.5, 0.9375]} />
              <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

useTexture.preload(projects.slice(0, 2).map((p) => p.screenshot));
