import { RoundedBox, useCursor, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { damp, damp3, dampQ } from 'maath/easing';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Color,
  Object3D,
  PerspectiveCamera,
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
import { framingFor, heroFrameScale, rectsOverlap, type ScreenRect } from '../lib/framing';
import { FRAME_SLOTS, WORLD } from '../lib/world';
import { useSceneStore } from '../store/scene-store';

const AMBER = new Color('#ffb45c');
const CYAN = new Color('#2fb6e8');
const UP = new Vector3(0, 1, 0);
const FRAME_W = 1.56;
const FRAME_H = 0.975;
const HERO_DISTANCE = 3.9;
const TOP_BAR_PX = 80;
/** While one frame is in front of the camera the rest spread out so none overlaps it. */
const SPREAD = { x: 1.5, y: 1.9 };
/** Extra push tried in turn for a neighbour still in the way; past the last it hides. */
const SPREAD_STEPS = [1, 1.35, 1.75];

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
      heroTarget: new Vector3(),
      ndc: new Vector3(),
      offset: new Vector3(),
      dummy: new Object3D(),
      heroRect: { x: 0, y: 0, halfW: 0, halfH: 0 } as ScreenRect,
      rect: { x: 0, y: 0, halfW: 0, halfH: 0 } as ScreenRect,
    }),
    [],
  );

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const progress = useSceneStore.getState().progress;
    const inProjects = sectionFromProgress(progress) === PROJECTS_SECTION;
    const active = activeProject(progress);
    const t = state.clock.elapsedTime;
    const fov = camera instanceof PerspectiveCamera ? camera.fov : 38;
    const heroScale = heroFrameScale(
      framingFor(PROJECTS_SECTION, size.width, size.height),
      size.height,
      fov,
      HERO_DISTANCE,
      { width: FRAME_W, height: FRAME_H },
    );
    const halfTan = Math.tan((fov * Math.PI) / 360);
    const aspect = size.width / size.height;
    const topLimit = 1 - (2 * TOP_BAR_PX) / size.height;
    const toRect = (position: Vector3, scale: number, out: ScreenRect): number => {
      const depth = v.offset.subVectors(position, camera.position).dot(v.forward);
      v.ndc.copy(position).project(camera);
      out.x = v.ndc.x;
      out.y = v.ndc.y;
      out.halfW = (FRAME_W * scale) / 2 / (Math.max(depth, 0.01) * halfTan * aspect);
      out.halfH = (FRAME_H * scale) / 2 / (Math.max(depth, 0.01) * halfTan);
      return depth;
    };
    v.heroTarget.copy(camera.position).addScaledVector(v.forward, HERO_DISTANCE);
    toRect(v.heroTarget, heroScale, v.heroRect);
    const spreadX = inProjects ? SPREAD.x : 1;
    const spreadY = inProjects ? SPREAD.y : 1;

    camera.getWorldDirection(v.forward);
    v.right.crossVectors(v.forward, UP).normalize();
    v.up.crossVectors(v.right, v.forward);

    refs.current.forEach((frame, i) => {
      const g = frame.group;
      const slot = FRAME_SLOTS[i];
      if (!g || !slot) return;
      const isHero = inProjects && i === active;
      let hidden = false;
      if (isHero) {
        v.target.copy(v.heroTarget);
        damp3(g.position, v.target, 0.32, delta);
        v.dummy.position.copy(g.position);
        v.dummy.lookAt(camera.position);
        const px = pointer.active ? pointer.x : 0;
        const py = pointer.active ? pointer.y : 0;
        v.dummy.rotateY(-px * 0.28);
        v.dummy.rotateX(py * 0.18);
        dampQ(g.quaternion, v.dummy.quaternion, 0.3, delta);
      } else {
        let blocked = false;
        for (const step of inProjects ? SPREAD_STEPS : [1]) {
          v.target.set(
            WORLD.helix.x + (slot.position[0] - WORLD.helix.x) * spreadX * step,
            WORLD.helix.y +
              (slot.position[1] - WORLD.helix.y) * spreadY * step +
              Math.sin(t * 0.7 + i * 1.3) * 0.08,
            slot.position[2],
          );
          if (!inProjects) break;
          // A neighbour that would land on the active frame or under the top bar moves out.
          const depth = toRect(v.target, 1, v.rect);
          blocked =
            depth < 0.5 ||
            rectsOverlap(v.rect, v.heroRect, 0.03) ||
            v.rect.y + v.rect.halfH > topLimit;
          if (!blocked) break;
        }
        hidden = blocked;
        damp3(g.position, v.target, 0.5, delta);
        v.dummy.position.copy(g.position);
        v.dummy.lookAt(slot.facing[0], slot.facing[1], slot.facing[2]);
        dampQ(g.quaternion, v.dummy.quaternion, 0.5, delta);
      }
      const shown = inProjects && !hidden ? 1 : 0.0001;
      const scale = (isHero ? heroScale : hovered === i ? 1.04 : 1) * shown;
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
