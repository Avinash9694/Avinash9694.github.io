import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import {
  BufferGeometry,
  Float32BufferAttribute,
  Vector3,
  type Group,
  type PerspectiveCamera,
} from 'three';
import { at } from '../../lib/at';
import type { Vec3 } from '../../lib/layout';
import { cameraPosition, fieldOfView, type View } from '../../lib/projection';
import { focusWorkEntry } from './focus-work-entry';
import type { GraphSceneProps } from './types';
import { useActive, useThemeColors, type GraphColors } from './use-graph-environment';

/** Radians per second. One turn takes a little under three minutes. */
const ROTATION_SPEED = 0.036;
const DIMMED = 0.18;

export default function GraphScene(props: GraphSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const active = useActive(rootRef);
  const colors = useThemeColors();
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lit = useLit(props, hovered);

  const rotating = active && hovered === null && !dragging;
  const hoveredNode = hovered === null ? undefined : props.nodes[hovered];
  const position = cameraPosition(props.view);
  const polar = Math.PI / 2 - props.view.elevation;

  return (
    <div
      ref={rootRef}
      className="graph-scene"
      data-ready={ready}
      data-pointer={hoveredNode?.kind === 'project' ? 'link' : undefined}
      aria-hidden="true"
      onTransitionEnd={(e) => {
        // Once the scene fully covers the drawing, hide the drawing's labels that
        // poke out past the edges, or they would sit under the live ones.
        if (e.target === e.currentTarget && ready) {
          e.currentTarget.closest('.graph')?.setAttribute('data-live', '');
        }
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={!active ? 'never' : rotating ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position, fov: 30, near: 0.1, far: 50 }}
        onCreated={() => requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))}
        onPointerMissed={() => setHovered(null)}
      >
        <FitCamera view={props.view} />
        <Graph
          {...props}
          colors={colors}
          hovered={hovered}
          lit={lit}
          rotating={rotating}
          onHover={setHovered}
          labelRefs={labelRefs}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={polar}
          maxPolarAngle={polar}
          onStart={() => setDragging(true)}
          onEnd={() => setDragging(false)}
        />
      </Canvas>
      <div className="graph-labels">
        {props.nodes.map((node, i) => (
          <span
            key={node.id}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="graph-label"
            data-kind={node.kind}
            data-state={lit ? (lit.has(i) ? 'lit' : 'dim') : undefined}
          >
            {node.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** The hovered node and its neighbours, or null when nothing is hovered. */
function useLit({ nodes, edges }: GraphSceneProps, hovered: number | null) {
  const neighbours = useMemo(() => {
    const map = nodes.map(() => new Set<number>());
    for (const [a, b] of edges) {
      map[a]?.add(b);
      map[b]?.add(a);
    }
    return map;
  }, [nodes, edges]);

  return useMemo(() => {
    if (hovered === null) return null;
    return new Set([hovered, ...(neighbours[hovered] ?? [])]);
  }, [hovered, neighbours]);
}

/** Keeps the same square in view as the SVG drawing, whatever the canvas shape. */
function FitCamera({ view }: { view: View }) {
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    const { camera, invalidate } = get();
    const perspective = camera as PerspectiveCamera;
    perspective.fov = fieldOfView(view, size.width, size.height);
    perspective.updateProjectionMatrix();
    invalidate();
  }, [get, size.width, size.height, view]);
  return null;
}

interface GraphProps extends GraphSceneProps {
  colors: GraphColors;
  hovered: number | null;
  lit: Set<number> | null;
  rotating: boolean;
  onHover: (index: number | null) => void;
  labelRefs: RefObject<(HTMLSpanElement | null)[]>;
}

function Graph({
  nodes,
  edges,
  positions,
  radii,
  colors,
  hovered,
  lit,
  rotating,
  onHover,
  labelRefs,
}: GraphProps) {
  const group = useRef<Group>(null);
  const point = useMemo(() => new Vector3(), []);

  useFrame(({ camera, size }, delta) => {
    const g = group.current;
    if (!g) return;
    // Clamp so a long pause (tab switch, scroll away) does not jump the graph.
    if (rotating) g.rotation.y += Math.min(delta, 0.1) * ROTATION_SPEED;
    g.updateMatrixWorld();
    // Labels are plain DOM text in the page font, positioned over their node.
    positions.forEach((p, i) => {
      const el = labelRefs.current[i];
      if (!el) return;
      point.set(p[0], p[1], p[2]).applyMatrix4(g.matrixWorld).project(camera);
      const half = el.offsetWidth / 2;
      // Keep the whole label inside the box on narrow screens.
      const x = clamp(((point.x + 1) / 2) * size.width, half, size.width - half);
      const y = ((1 - point.y) / 2) * size.height;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, 7px)`;
    });
  });

  const [plainEdges, litEdges] = useMemo(() => {
    const plain: [number, number][] = [];
    const bright: [number, number][] = [];
    for (const e of edges) (hovered !== null && e.includes(hovered) ? bright : plain).push(e);
    return [segments(plain, positions), segments(bright, positions)];
  }, [edges, positions, hovered]);

  useEffect(
    () => () => {
      plainEdges.dispose();
      litEdges.dispose();
    },
    [plainEdges, litEdges],
  );

  return (
    <group ref={group}>
      <lineSegments geometry={plainEdges}>
        <lineBasicMaterial
          color={colors.edge}
          transparent
          opacity={lit ? 0.06 : 0.2}
          depthWrite={false}
        />
      </lineSegments>
      <lineSegments geometry={litEdges}>
        <lineBasicMaterial color={colors.accent} transparent opacity={0.85} depthWrite={false} />
      </lineSegments>

      {nodes.map((node, i) => {
        const isProject = node.kind === 'project';
        const r = isProject ? radii.project : radii.tech;
        const on = lit?.has(i) ?? false;
        const base = isProject ? colors.ink : colors.tech;
        const select = (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          // A drag that happens to end on a node is a rotation, not a click.
          if (e.delta > 6 || !node.anchor) return;
          focusWorkEntry(node.anchor);
        };
        return (
          <group
            key={node.id}
            position={positions[i]}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(i);
            }}
            onPointerOut={() => onHover(null)}
            onClick={isProject ? select : undefined}
          >
            <mesh>
              <sphereGeometry args={[r, 24, 16]} />
              <meshBasicMaterial
                color={on ? colors.accent : base}
                transparent
                opacity={lit && !on ? DIMMED : 1}
              />
            </mesh>
            {/* A larger invisible target, since the dots are only a few pixels wide. */}
            <mesh>
              <sphereGeometry args={[r * 2.6, 8, 6]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function segments(pairs: [number, number][], positions: Vec3[]): BufferGeometry {
  const data: number[] = [];
  for (const [a, b] of pairs) data.push(...at(positions, a), ...at(positions, b));
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(data, 3));
  return geometry;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
