import { PROJECT_STATIONS, ROLE_STATIONS } from './progress-map';
import { FRAME_SLOTS, TIMELINE_NODES, WORLD, type Vec3 } from './world';

export interface Keyframe {
  /** Scroll progress in [0, 1] at which the camera sits exactly here. */
  at: number;
  position: Vec3;
  target: Vec3;
}

function roleKeyframe(index: number): Keyframe {
  const node = TIMELINE_NODES[index] ?? [0, 0, 0];
  return {
    at: ROLE_STATIONS[index] ?? 0,
    position: [node[0] + 2.9, node[1] + 1.3, node[2] + 4.0],
    target: [node[0] + 0.6, node[1] + 0.1, node[2]],
  };
}

function projectKeyframe(index: number): Keyframe {
  const slot = FRAME_SLOTS[index] ?? { z: 0 };
  const { x, y } = WORLD.helix;
  return {
    at: PROJECT_STATIONS[index] ?? 0,
    position: [x, y + 0.2, slot.z + 3.6],
    target: [x + 0.4, y - 0.1, slot.z - 4],
  };
}

export const KEYFRAMES: Keyframe[] = [
  { at: 0, position: [0, 3.3, 11.6], target: [0, 1.95, -0.4] },
  { at: 0.15, position: [0.8, 3.1, 10.6], target: [0, 1.9, -0.4] },
  { at: 0.225, position: [2.4, 1.5, 2.3], target: [0, 1.0, -0.5] },
  { at: 0.36, position: [2.0, 1.45, 2.05], target: [0, 1.0, -0.5] },
  { at: 0.395, position: [-2.6, 3.4, 10.5], target: [-6.5, 1.6, 13] },
  ...ROLE_STATIONS.map((_, i) => roleKeyframe(i)),
  ...PROJECT_STATIONS.map((_, i) => projectKeyframe(i)),
  { at: 0.86, position: [0.5, 9.6, 8.4], target: [0, 0.7, -0.5] },
  { at: 1, position: [-1.6, 10.4, 6.8], target: [0, 0.7, -0.5] },
];

/**
 * Maps scroll progress to the Catmull-Rom parameter t, piecewise-linearly between
 * keyframes, so keyframe i is reached at exactly t = i / (n - 1).
 */
export function progressToT(progress: number, keyframes: Keyframe[] = KEYFRAMES): number {
  const n = keyframes.length;
  if (n < 2) return 0;
  const p = Math.min(1, Math.max(0, progress));
  const first = keyframes[0];
  const last = keyframes[n - 1];
  if (!first || !last) return 0;
  if (p <= first.at) return 0;
  if (p >= last.at) return 1;
  for (let i = 0; i < n - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (!a || !b) break;
    if (p >= a.at && p <= b.at) {
      const span = b.at - a.at;
      const frac = span > 0 ? (p - a.at) / span : 0;
      return (i + frac) / (n - 1);
    }
  }
  return 1;
}

export function keyframesAreOrdered(keyframes: Keyframe[] = KEYFRAMES): boolean {
  return keyframes.every((k, i) => i === 0 || k.at > (keyframes[i - 1]?.at ?? -1));
}

/** A portrait viewport sees too little of the world at the desktop FOV, so it widens. */
export function portraitFov(aspect: number): number {
  if (aspect >= 1.2) return 38;
  if (aspect <= 0.6) return 52;
  return 38 + ((1.2 - aspect) / 0.6) * 14;
}
