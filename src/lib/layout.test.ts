import { describe, expect, it } from 'vitest';
import { buildGraph } from '../data/graph';
import { at } from './at';
import { boundingRadius, computeLayout, distance } from './layout';
import { GRAPH_SEED, layoutGraph, MIN_NODE_DISTANCE } from './graph-view';

const graph = buildGraph();
const layout = () => layoutGraph(graph);

describe('computeLayout', () => {
  it('is deterministic for a fixed seed', () => {
    expect(layout()).toEqual(layout());
  });

  it('changes with the seed', () => {
    const run = (seed: number) => computeLayout(graph.nodes.length, graph.edges, { seed });
    expect(run(GRAPH_SEED)).toEqual(run(GRAPH_SEED));
    expect(run(GRAPH_SEED + 1)).not.toEqual(run(GRAPH_SEED));
  });

  it('returns one finite position per node', () => {
    const pos = layout();
    expect(pos).toHaveLength(graph.nodes.length);
    for (const p of pos) for (const v of p) expect(Number.isFinite(v)).toBe(true);
  });

  it('fits roughly within unit radius', () => {
    const r = boundingRadius(layout());
    expect(r).toBeGreaterThan(0.9);
    expect(r).toBeLessThan(1.2);
  });

  it('keeps every pair of nodes apart', () => {
    const pos = layout();
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        expect(distance(at(pos, i), at(pos, j))).toBeGreaterThanOrEqual(MIN_NODE_DISTANCE);
      }
    }
  });

  it('places connected nodes closer together than unconnected ones on average', () => {
    const pos = layout();
    const linked = new Set(graph.edges.map(([a, b]) => `${a}-${b}`));
    let near = 0;
    let nearCount = 0;
    let far = 0;
    let farCount = 0;
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const d = distance(at(pos, i), at(pos, j));
        if (linked.has(`${i}-${j}`) || linked.has(`${j}-${i}`)) {
          near += d;
          nearCount++;
        } else {
          far += d;
          farCount++;
        }
      }
    }
    expect(near / nearCount).toBeLessThan((far / farCount) * 0.8);
  });

  it('handles an empty graph', () => {
    expect(computeLayout(0, [], { seed: 1 })).toEqual([]);
  });
});

describe('the site graph', () => {
  it('keeps the eight project nodes well apart', () => {
    const pos = layout();
    const projectsOnly = graph.nodes.flatMap((n, i) => (n.kind === 'project' ? [at(pos, i)] : []));
    for (let i = 0; i < projectsOnly.length; i++) {
      for (let j = i + 1; j < projectsOnly.length; j++) {
        expect(distance(at(projectsOnly, i), at(projectsOnly, j))).toBeGreaterThan(0.35);
      }
    }
  });
});
