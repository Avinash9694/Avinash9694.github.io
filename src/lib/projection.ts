import type { Vec3 } from './layout';

/**
 * The camera both the static SVG and the WebGL scene start from. The SVG is a
 * fixed projection through this camera, so when the canvas fades in over it the
 * two line up.
 */
export interface View {
  /** Distance from the camera to the origin. */
  distance: number;
  /** Camera height angle above the XZ plane, in radians. */
  elevation: number;
  /** Half the width and height of the square the graph is fitted into, in projected units. */
  halfExtent: number;
}

export function cameraPosition({ distance, elevation }: View): Vec3 {
  return [0, Math.sin(elevation) * distance, Math.cos(elevation) * distance];
}

/** Perspective projection matching a camera at `cameraPosition(view)` looking at the origin. */
export function project(p: Vec3, view: View): { x: number; y: number; depth: number } {
  const { distance: d, elevation: e } = view;
  // Camera basis for lookAt(0,0,0) from (0, d sin e, d cos e): x stays the world x axis.
  const back: Vec3 = [0, Math.sin(e), Math.cos(e)];
  const up: Vec3 = [0, Math.cos(e), -Math.sin(e)];
  const depth = d - (p[1] * back[1] + p[2] * back[2]);
  const camY = p[1] * up[1] + p[2] * up[2];
  return { x: (p[0] * d) / depth, y: (-camY * d) / depth, depth };
}

/**
 * The square half-extent that keeps a graph of `radius` inside the frame at
 * every rotation: the worst case is a node at full radius nearest the camera.
 */
export function fitHalfExtent(radius: number, distance: number, margin = 1.08): number {
  return ((radius * distance) / (distance - radius)) * margin;
}

/**
 * Vertical field of view (degrees) for a canvas of `width` x `height` CSS pixels
 * that shows the same square as an SVG with preserveAspectRatio="xMidYMid meet".
 */
export function fieldOfView(view: View, width: number, height: number): number {
  const shortSide = Math.max(1, Math.min(width, height));
  const half = Math.atan((view.halfExtent * height) / (view.distance * shortSide));
  return (half * 2 * 180) / Math.PI;
}
