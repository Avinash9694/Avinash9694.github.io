import { roles } from '../data/experience';
import { PROJECT_COUNT } from '../data/projects';

export type Vec3 = readonly [number, number, number];

/** Shared world layout: the scene builds objects here and the camera path aims at them. */
export const WORLD = {
  islandRadius: 3.7,
  deskTop: 0.8,
  monitorScreen: [0, 1.32, -0.42] as Vec3,
  nameCenter: [0, 2.95, -0.55] as Vec3,
  lamp: [-1.55, 0.8, -0.35] as Vec3,
  /** Oldest role furthest out in front of the island, newest nearest it. */
  timeline: { x: -9, y: 1.5, zStart: 13, zStep: -4.5 },
  helix: { x: 11.5, y: 1.9, zStart: 9, zStep: 2.3, radius: 2.4, turn: Math.PI * 0.46 },
} as const;

export function timelineNode(index: number): Vec3 {
  const { x, y, zStart, zStep } = WORLD.timeline;
  return [
    x + Math.sin(index * 1.7) * 0.35,
    y + Math.cos(index * 2.1) * 0.25,
    zStart + index * zStep,
  ];
}

export const TIMELINE_NODES: Vec3[] = roles.map((_, i) => timelineNode(i));

/** Control points for the glowing tube: the nodes, with a lead-in and a tail. */
export function timelinePath(): Vec3[] {
  const { x, y, zStart, zStep } = WORLD.timeline;
  const last = TIMELINE_NODES.length - 1;
  return [
    [x - 0.9, y - 0.6, zStart - zStep * 0.8],
    ...TIMELINE_NODES,
    [x + 0.4, y + 0.8, zStart + zStep * (last + 0.35)],
  ];
}

export interface FrameSlot {
  position: Vec3;
  /** A point the frame faces, back along the axis toward the approaching camera. */
  facing: Vec3;
  z: number;
}

export function helixFrame(index: number): FrameSlot {
  const { x, y, zStart, zStep, radius, turn } = WORLD.helix;
  const angle = Math.PI * 0.5 + index * turn;
  const z = zStart - index * zStep;
  return {
    position: [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius * 0.55, z],
    facing: [x, y + 0.2, z + 7],
    z,
  };
}

export const FRAME_SLOTS: FrameSlot[] = Array.from({ length: PROJECT_COUNT }, (_, i) =>
  helixFrame(i),
);
