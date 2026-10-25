/**
 * One source for the Projects section and the hero graph, so the two cannot drift:
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

export interface Project {
  slug: string;
  title: string;
  summary: string;
  live: string;
  code: string;
  tech: TechId[];
  image: { src: string; alt: string; width: number; height: number };
}

export const projects: Project[] = [
  {
    slug: 'iam-policy-analyzer',
    title: 'IAM Policy Analyzer',
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
    summary:
      'Lets Claude or Cursor check an AWS account for common security problems through read-only tools. It ships with sample data, so you can try it without credentials.',
    live: 'https://avinash9694.github.io/cloud-audit-mcp/',
    code: 'https://github.com/Avinash9694/cloud-audit-mcp',
    tech: ['typescript', 'node', 'mcp', 'aws', 'iam'],
    image: {
      src: '/screenshots/cloud-audit-mcp.webp',
      alt: 'The Cloud Audit MCP Server documentation page, with install instructions and a sample conversation.',
      width: 1200,
      height: 750,
    },
  },
  {
    slug: 'sse-stream-inspector',
    title: 'SSE Stream Inspector',
    summary:
      'A debugger for the event streams chat backends send. I built it after an event that was quietly renamed in one place cost me a day.',
    live: 'https://avinash9694.github.io/sse-stream-inspector/',
    code: 'https://github.com/Avinash9694/sse-stream-inspector',
    tech: ['react', 'typescript', 'sse'],
    image: {
      src: '/screenshots/sse-stream-inspector.webp',
      alt: 'SSE Stream Inspector showing a captured stream as a timeline of events, with one event open for inspection.',
      width: 1200,
      height: 750,
    },
  },
  {
    slug: 'northline',
    title: 'Northline',
    summary:
      "A full e-commerce app with an Express and MongoDB backend. The demo runs entirely in your browser, so there's no server to wait for.",
    live: 'https://avinash9694.github.io/Ecommerce-APP/',
    code: 'https://github.com/Avinash9694/Ecommerce-APP',
    tech: ['react', 'typescript', 'node', 'express', 'mongodb'],
    image: {
      src: '/screenshots/Ecommerce-APP.webp',
      alt: 'The Northline storefront home page, with featured products and shopping categories.',
      width: 1200,
      height: 750,
    },
  },
  {
    slug: 'iac-diff-viewer',
    title: 'IaC Diff Viewer',
    summary:
      'Compares two CloudFormation or Terraform files resource by resource and points out the risky changes, like a database being removed.',
    live: 'https://avinash9694.github.io/iac-diff-viewer/',
    code: 'https://github.com/Avinash9694/iac-diff-viewer',
    tech: ['rust', 'react', 'typescript', 'terraform', 'aws'],
    image: {
      src: '/screenshots/iac-diff-viewer.webp',
      alt: 'IaC Diff Viewer listing changed resources grouped by risk, with a removed database selected.',
      width: 1200,
      height: 750,
    },
  },
  {
    slug: 'taste-of-india-hub',
    title: 'Taste of India Hub',
    summary:
      'A recipe site for Indian home cooking. You can search by ingredient, filter by region and diet, and tick off ingredients as you cook. I first built it in 2023 and rebuilt it properly this year.',
    live: 'https://avinash9694.github.io/TasteOfIndiaHub/',
    code: 'https://github.com/Avinash9694/TasteOfIndiaHub',
    tech: ['react', 'typescript', 'firebase'],
    image: {
      src: '/screenshots/TasteOfIndiaHub.webp',
      alt: 'The Taste of India Hub home page, with a large heading and a grid of dish photos.',
      width: 1200,
      height: 750,
    },
  },
  {
    slug: 'laundry-cart',
    title: 'Laundry Cart',
    summary:
      'Ordering for a laundry service. You pick garments and wash types, see the price as you go, and then follow the order from pickup to delivery. The API lives in a separate repo.',
    live: 'https://avinash9694.github.io/Laundry-cart-frontend/',
    code: 'https://github.com/Avinash9694/Laundry-cart-frontend',
    tech: ['react', 'typescript', 'node', 'express', 'mongodb'],
    image: {
      src: '/screenshots/Laundry-cart-frontend.webp',
      alt: 'The Laundry Cart dashboard, showing orders in progress, total spent and recent orders.',
      width: 1200,
      height: 750,
    },
  },
  {
    slug: '3d-virtual-environment',
    title: '3D Virtual Environment',
    summary:
      'A small three.js world you can walk around in as one of three characters, with the keyboard or a touch joystick. Mostly an excuse to learn WebGL properly.',
    live: 'https://avinash9694.github.io/3D-Virtual-Environment/',
    code: 'https://github.com/Avinash9694/3D-Virtual-Environment',
    tech: ['three', 'typescript'],
    image: {
      src: '/screenshots/3D-Virtual-Environment.webp',
      alt: 'A robot avatar standing in a paved plaza with trees, houses and a cutaway room.',
      width: 1200,
      height: 750,
    },
  },
];

/** The id of the project's entry in the Projects section, which its graph node scrolls to. */
export function projectAnchor(project: Pick<Project, 'slug'>): string {
  return `project-${project.slug}`;
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
    anchor: projectAnchor(p),
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
