/**
 * One source for the Work section and the hero graph, so the two cannot drift:
 * every project lists the technology it actually uses, and those lists are the
 * graph's edges.
 */

export const techs = {
  react: 'React',
  typescript: 'TypeScript',
  node: 'Node.js',
  aws: 'AWS',
  express: 'Express',
  mongodb: 'MongoDB',
  rust: 'Rust/WASM',
  three: 'three.js',
  firebase: 'Firebase',
  mcp: 'MCP',
  sse: 'Server-Sent Events',
  terraform: 'Terraform',
  iam: 'IAM',
} as const;

export type TechId = keyof typeof techs;

/** featured: large entry with a screenshot. listed: plain list entry. older: named in the closing line only. */
export type ProjectTier = 'featured' | 'listed' | 'older';

export interface Project {
  slug: string;
  title: string;
  tier: ProjectTier;
  summary: string;
  live: string;
  code: string;
  tech: TechId[];
  image?: { src: string; alt: string; width: number; height: number };
  /** How the closing line refers to an older project. */
  phrase?: string;
}

export const projects: Project[] = [
  {
    slug: 'iam-policy-analyzer',
    title: 'IAM Policy Analyzer',
    tier: 'featured',
    summary:
      "Paste an AWS IAM policy and it tells you what's risky: wildcards, ways to escalate privileges, public access, missing conditions. Each problem comes with a safer version of the statement you can copy. It runs entirely in your browser.",
    live: 'https://avinash9694.github.io/iam-policy-analyzer/',
    code: 'https://github.com/Avinash9694/iam-policy-analyzer',
    tech: ['react', 'typescript', 'aws', 'iam'],
    image: {
      src: '/screenshots/iam-policy-analyzer.webp',
      alt: 'IAM Policy Analyzer showing a pasted policy on the left and a ranked list of risky statements on the right.',
      width: 1200,
      height: 750,
    },
  },
  {
    slug: 'cloud-audit-mcp',
    title: 'Cloud Audit MCP Server',
    tier: 'listed',
    summary:
      'Lets Claude or Cursor check an AWS account for common security problems through read-only tools. It ships with sample data, so you can try it without credentials.',
    live: 'https://avinash9694.github.io/cloud-audit-mcp/',
    code: 'https://github.com/Avinash9694/cloud-audit-mcp',
    tech: ['typescript', 'node', 'mcp', 'aws', 'iam'],
  },
  {
    slug: 'sse-stream-inspector',
    title: 'SSE Stream Inspector',
    tier: 'listed',
    summary:
      'A debugger for the event streams chat backends send. I built it after an event that was quietly renamed in one place cost me a day.',
    live: 'https://avinash9694.github.io/sse-stream-inspector/',
    code: 'https://github.com/Avinash9694/sse-stream-inspector',
    tech: ['react', 'typescript', 'sse'],
  },
  {
    slug: 'northline',
    title: 'Northline',
    tier: 'listed',
    summary:
      "A full e-commerce app with an Express and MongoDB backend. The demo runs entirely in your browser, so there's no server to wait for.",
    live: 'https://avinash9694.github.io/Ecommerce-APP/',
    code: 'https://github.com/Avinash9694/Ecommerce-APP',
    tech: ['react', 'typescript', 'node', 'express', 'mongodb'],
  },
  {
    slug: 'iac-diff-viewer',
    title: 'IaC Diff Viewer',
    tier: 'listed',
    summary:
      'Compares two CloudFormation or Terraform files resource by resource and points out the risky changes, like a database being removed.',
    live: 'https://avinash9694.github.io/iac-diff-viewer/',
    code: 'https://github.com/Avinash9694/iac-diff-viewer',
    tech: ['rust', 'react', 'typescript', 'terraform', 'aws'],
  },
  {
    slug: 'taste-of-india-hub',
    title: 'Taste of India Hub',
    tier: 'older',
    phrase: 'a recipe site',
    summary: 'A recipe site with ingredient search and saved checklists.',
    live: 'https://avinash9694.github.io/TasteOfIndiaHub/',
    code: 'https://github.com/Avinash9694/TasteOfIndiaHub',
    tech: ['react', 'typescript', 'firebase'],
  },
  {
    slug: 'laundry-cart',
    title: 'Laundry Cart',
    tier: 'older',
    phrase: 'a laundry ordering app',
    summary: 'Order and track laundry pickups.',
    live: 'https://avinash9694.github.io/Laundry-cart-frontend/',
    code: 'https://github.com/Avinash9694/Laundry-cart-frontend',
    tech: ['react', 'typescript', 'node', 'express', 'mongodb'],
  },
  {
    slug: '3d-virtual-environment',
    title: '3D Virtual Environment',
    tier: 'older',
    phrase: 'a small three.js world',
    summary: 'A small world you can walk around in.',
    live: 'https://avinash9694.github.io/3D-Virtual-Environment/',
    code: 'https://github.com/Avinash9694/3D-Virtual-Environment',
    tech: ['three', 'typescript'],
  },
];

/** The id of the element in the Work section that a project's graph node scrolls to. */
export function workAnchor(project: Pick<Project, 'slug' | 'tier'>): string {
  return project.tier === 'older' ? 'older-work' : `work-${project.slug}`;
}

export type GraphNodeKind = 'project' | 'tech';

export interface GraphNode {
  id: string;
  label: string;
  kind: GraphNodeKind;
  /** Element id to scroll to when a project node is clicked. */
  anchor?: string;
}

export interface Graph {
  nodes: GraphNode[];
  /** Pairs of indices into `nodes`, project first. */
  edges: [number, number][];
}

export function buildGraph(list: Project[] = projects): Graph {
  const nodes: GraphNode[] = list.map((p) => ({
    id: p.slug,
    label: p.title,
    kind: 'project',
    anchor: workAnchor(p),
  }));
  const techIndex = new Map<TechId, number>();
  for (const id of Object.keys(techs) as TechId[]) {
    techIndex.set(id, nodes.length);
    nodes.push({ id: `tech:${id}`, label: techs[id], kind: 'tech' });
  }
  const edges: [number, number][] = [];
  list.forEach((p, i) => {
    for (const t of new Set(p.tech)) {
      const j = techIndex.get(t);
      if (j !== undefined) edges.push([i, j]);
    }
  });
  return { nodes, edges };
}
