import { createRng } from './prng';

export type Vec3 = [number, number, number];

export interface LayoutOptions {
  seed: number;
  iterations?: number;
  /** Ideal edge length, before the result is scaled to unit radius. */
  linkLength?: number;
  /** Smallest distance allowed between any two nodes in the final, unit-radius layout. */
  minDistance?: number;
  /** Strength of the pairwise push, the edge pull and the pull towards the centre. */
  repulsion?: number;
  spring?: number;
  gravity?: number;
  /** Per-node multiplier on the push; heavier nodes keep more room around them. */
  charges?: readonly number[];
}

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (v: Vec3) => Math.hypot(v[0], v[1], v[2]);

/** target += v * s, in place. */
function addScaled(target: Vec3, v: Vec3, s: number) {
  target[0] += v[0] * s;
  target[1] += v[1] * s;
  target[2] += v[2] * s;
}

export function distance(a: Vec3, b: Vec3): number {
  return len(sub(a, b));
}

/** Visits every unordered pair once. */
function forEachPair<T>(items: readonly T[], fn: (a: T, b: T, i: number, j: number) => void) {
  items.forEach((a, i) => {
    for (let j = i + 1; j < items.length; j++) {
      const b = items[j];
      if (b !== undefined) fn(a, b, i, j);
    }
  });
}

/**
 * A plain force-directed layout in 3D: every pair repels, edges pull like
 * springs, a weak pull keeps the whole thing centred. It runs at build time, so
 * it only has to be deterministic and good-looking, not fast.
 */
export function computeLayout(
  nodeCount: number,
  edges: readonly (readonly [number, number])[],
  {
    seed,
    iterations = 600,
    linkLength = 1,
    minDistance = 0.2,
    repulsion = 0.6,
    spring = 0.08,
    gravity = 0.02,
    charges,
  }: LayoutOptions,
): Vec3[] {
  const rng = createRng(seed);
  const pos: Vec3[] = Array.from({ length: nodeCount }, () => {
    // Uniform point in a ball, so the start has no preferred axis.
    const u = rng() * 2 - 1;
    const phi = rng() * Math.PI * 2;
    const r = Math.cbrt(rng()) * 2;
    const s = Math.sqrt(1 - u * u);
    return [r * s * Math.cos(phi), r * s * Math.sin(phi), r * u];
  });
  const charge = (i: number) => charges?.[i] ?? 1;
  const push = repulsion * linkLength * linkLength;

  for (let it = 0; it < iterations; it++) {
    const force: Vec3[] = pos.map((p) => [-p[0] * gravity, -p[1] * gravity, -p[2] * gravity]);

    forEachPair(pos, (a, b, i, j) => {
      const d = sub(a, b);
      const dist = Math.max(len(d), 0.01);
      const f = (push * charge(i) * charge(j)) / (dist * dist * dist);
      const fi = force[i];
      const fj = force[j];
      if (fi) addScaled(fi, d, f);
      if (fj) addScaled(fj, d, -f);
    });

    for (const [a, b] of edges) {
      const pa = pos[a];
      const pb = pos[b];
      const fa = force[a];
      const fb = force[b];
      if (!pa || !pb || !fa || !fb) continue;
      const d = sub(pb, pa);
      const dist = Math.max(len(d), 0.01);
      const f = (spring * (dist - linkLength)) / dist;
      addScaled(fa, d, f);
      addScaled(fb, d, -f);
    }

    const maxStep = 0.25 * (1 - it / iterations) + 0.005;
    pos.forEach((p, i) => {
      const f = force[i];
      if (!f) return;
      const step = len(f);
      addScaled(p, f, step > maxStep ? maxStep / step : 1);
    });
  }

  normalise(pos);
  separate(pos, minDistance);
  const round = (v: number) => Math.round(v * 1e4) / 1e4;
  return pos.map(([x, y, z]) => [round(x), round(y), round(z)]);
}

/** Centre on the origin and scale so the farthest node sits at radius 1. */
function normalise(pos: Vec3[]) {
  if (pos.length === 0) return;
  const centre: Vec3 = [0, 0, 0];
  for (const p of pos) addScaled(centre, p, 1 / pos.length);
  for (const p of pos) addScaled(p, centre, -1);
  const max = boundingRadius(pos);
  if (max > 0) for (const p of pos) p.forEach((_, k) => (p[k] = (p[k] ?? 0) / max));
}

/** Push apart any pair closer than `min` (with a little slack for rounding). */
function separate(pos: Vec3[], min: number) {
  const target = min * 1.02;
  for (let pass = 0; pass < 50; pass++) {
    let moved = false;
    forEachPair(pos, (a, b) => {
      const d = sub(b, a);
      const dist = len(d);
      if (dist >= target) return;
      moved = true;
      const dir: Vec3 = dist > 1e-6 ? [d[0] / dist, d[1] / dist, d[2] / dist] : [1, 0, 0];
      const shift = (target - dist) / 2;
      addScaled(a, dir, -shift);
      addScaled(b, dir, shift);
    });
    if (!moved) return;
  }
}

export function boundingRadius(pos: readonly Vec3[]): number {
  return pos.reduce((m, p) => Math.max(m, len(p)), 0);
}
