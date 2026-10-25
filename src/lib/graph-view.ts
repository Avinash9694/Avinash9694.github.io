import { buildGraph, projects, type Graph, type GraphNode } from '../data/graph';
import { at } from './at';
import { boundingRadius, computeLayout, type Vec3 } from './layout';
import { fitHalfExtent, project, type View } from './projection';

/** Picked by trying seeds until no two project labels overlapped in the starting view. */
export const GRAPH_SEED = 2677;
export const MIN_NODE_DISTANCE = 0.2;
const CAMERA_DISTANCE = 6;
const CAMERA_ELEVATION = 0.32;

/** Projects push harder than technologies so their labels get room; hubs settle in the middle. */
export const LAYOUT_FORCES = { repulsion: 0.15, spring: 0.4, gravity: 0.08, projectCharge: 4 };

export function layoutGraph(graph: Graph): Vec3[] {
  const { projectCharge, ...forces } = LAYOUT_FORCES;
  return computeLayout(graph.nodes.length, graph.edges, {
    seed: GRAPH_SEED,
    minDistance: MIN_NODE_DISTANCE,
    ...forces,
    charges: graph.nodes.map((n) => (n.kind === 'project' ? projectCharge : 1)),
  });
}

export interface GraphView {
  nodes: GraphNode[];
  edges: [number, number][];
  positions: Vec3[];
  view: View;
  /** Node radii in world units, matching NODE_RADIUS in the drawing at the origin's depth. */
  radii: { project: number; tech: number };
}

/** Size of the SVG viewBox. Node radii and font sizes are in these units. */
export const SVG_SIZE = 460;
/** Label font size in viewBox units on small screens, the larger of the two the CSS uses. */
const LABEL_FONT_MAX = 16;
/** Average glyph width of the body face relative to its size, for estimating label width. */
const GLYPH_WIDTH = 0.5;
export const NODE_RADIUS = { project: 5.5, tech: 3.75 } as const;

/** Everything the page needs to draw the graph, computed once at build time. */
export function createGraphView(): GraphView {
  const graph = buildGraph(projects);
  const { nodes, edges } = graph;
  const positions = layoutGraph(graph);
  const halfExtent = fitHalfExtent(boundingRadius(positions), CAMERA_DISTANCE, 1.02);
  const unitsPerWorld = SVG_SIZE / 2 / halfExtent;
  return {
    nodes,
    edges,
    positions,
    view: { distance: CAMERA_DISTANCE, elevation: CAMERA_ELEVATION, halfExtent },
    radii: {
      project: NODE_RADIUS.project / unitsPerWorld,
      tech: NODE_RADIUS.tech / unitsPerWorld,
    },
  };
}

export interface SvgNode extends GraphNode {
  x: number;
  y: number;
  /** Label x, pulled in from the edges so the label fits inside the box. */
  labelX: number;
  r: number;
  depth: number;
}

/** The static drawing: the 3D layout seen from the scene's starting camera. */
export function projectForSvg({ nodes, edges, positions, view }: GraphView) {
  const scale = SVG_SIZE / 2 / view.halfExtent;
  const points: SvgNode[] = nodes.map((n, i) => {
    const p = project(at(positions, i), view);
    // Same perspective scaling the WebGL camera applies to the spheres.
    const r = NODE_RADIUS[n.kind] * (view.distance / p.depth);
    const x = p.x * scale;
    const room = SVG_SIZE / 2 - (n.label.length * LABEL_FONT_MAX * GLYPH_WIDTH) / 2;
    const labelX = Math.min(Math.max(x, -room), room);
    return {
      ...n,
      x: round(x),
      y: round(p.y * scale),
      labelX: round(labelX),
      r: round(r),
      depth: p.depth,
    };
  });
  const lines = edges.map(([a, b]) => ({ a: at(points, a), b: at(points, b) }));
  const order = points.toSorted((p, q) => q.depth - p.depth);
  return { points, lines, order };
}

const round = (v: number) => Math.round(v * 10) / 10;
