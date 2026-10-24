export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  live: string | null;
  source: string;
  featured: boolean;
  cover: { from: string; to: string };
  /** Optional screenshot path (under /public). Rendered over the cover when present. */
  screenshot?: string;
}

export const projects: Project[] = [
  {
    slug: 'iam-policy-analyzer',
    title: 'IAM Policy Analyzer',
    tagline: 'Ranked security findings for any AWS IAM policy, entirely in the browser.',
    description:
      'Paste an AWS IAM policy and get ranked findings: wildcard actions and resources, privilege-escalation paths such as iam:PassRole combined with lambda:CreateFunction, missing conditions and NotAction pitfalls, each with a concrete fix. Everything runs client-side with no backend.',
    tags: ['React', 'TypeScript', 'AWS IAM', 'Vitest', 'Security'],
    live: 'https://avinash9694.github.io/iam-policy-analyzer/',
    source: 'https://github.com/Avinash9694/iam-policy-analyzer',
    featured: true,
    cover: { from: '#7c6cff', to: '#3b2fb5' },
  },
  {
    slug: 'cloud-audit-mcp',
    title: 'Cloud Audit MCP Server',
    tagline: 'Read-only AWS posture checks exposed as Model Context Protocol tools.',
    description:
      'A TypeScript Model Context Protocol server that gives Claude and Cursor read-only AWS posture checks as tools: public S3 buckets, open security groups, unencrypted EBS volumes, IAM users without MFA and more. Ships with an offline fixture mode for development and a documentation site.',
    tags: ['TypeScript', 'MCP', 'AWS SDK v3', 'Node', 'Zod'],
    live: 'https://avinash9694.github.io/cloud-audit-mcp/',
    source: 'https://github.com/Avinash9694/cloud-audit-mcp',
    featured: true,
    cover: { from: '#2dd4bf', to: '#1e3a8a' },
  },
  {
    slug: 'sse-stream-inspector',
    title: 'SSE Stream Inspector',
    tagline: 'Record, replay and diff Server-Sent Events frame by frame.',
    description:
      'Record or paste a Server-Sent Events stream, replay it frame by frame, diff payloads between frames and catch renamed or dropped event names before they reach production. Parsing runs in a Web Worker so large recordings never block the UI.',
    tags: ['React', 'TypeScript', 'EventSource', 'Web Workers', 'Vitest'],
    live: 'https://avinash9694.github.io/sse-stream-inspector/',
    source: 'https://github.com/Avinash9694/sse-stream-inspector',
    featured: false,
    cover: { from: '#f472b6', to: '#7c3aed' },
  },
  {
    slug: 'iac-diff-viewer',
    title: 'IaC Diff Viewer',
    tagline: 'Resource-level diffs of CloudFormation and Terraform state, with risk tags.',
    description:
      'A semantic, resource-level diff of two CloudFormation or Terraform JSON states with risk tagging for destructive changes. The diff engine is written in Rust and compiled to WebAssembly; a React shell renders the result.',
    tags: ['Rust', 'WebAssembly', 'React', 'TypeScript', 'CloudFormation'],
    live: 'https://avinash9694.github.io/iac-diff-viewer/',
    source: 'https://github.com/Avinash9694/iac-diff-viewer',
    featured: false,
    cover: { from: '#fb923c', to: '#9f1239' },
  },
  {
    slug: 'TasteOfIndiaHub',
    title: 'Taste of India Hub',
    tagline: 'Recipe discovery with chefs, recipes and a blog.',
    description:
      'A recipe discovery app with chef profiles, recipes and a blog, backed by Firebase authentication. Fully responsive and rebuilt on Vite and TypeScript.',
    tags: ['React', 'TypeScript', 'Firebase Auth', 'Vite'],
    live: 'https://avinash9694.github.io/TasteOfIndiaHub/',
    source: 'https://github.com/Avinash9694/TasteOfIndiaHub',
    featured: false,
    cover: { from: '#facc15', to: '#c2410c' },
  },
  {
    slug: 'Ecommerce-APP',
    title: 'Storefront',
    tagline: 'Full-stack e-commerce with a demo mode that runs on GitHub Pages.',
    description:
      'An Express and MongoDB API with JWT authentication, products, cart, orders and an admin area, paired with a React storefront that runs in demo mode on GitHub Pages when no API is available.',
    tags: ['React', 'TypeScript', 'Node', 'Express', 'MongoDB', 'JWT'],
    live: 'https://avinash9694.github.io/Ecommerce-APP/',
    source: 'https://github.com/Avinash9694/Ecommerce-APP',
    featured: false,
    cover: { from: '#38bdf8', to: '#0f766e' },
  },
  {
    slug: 'Laundry-cart-frontend',
    title: 'Laundry Cart',
    tagline: 'Order management for a laundry service.',
    description:
      'Create orders by garment and wash type, browse order history and sign in securely. The Express and MongoDB API lives in a sibling repository.',
    tags: ['React', 'TypeScript', 'Node', 'Express', 'MongoDB'],
    live: 'https://avinash9694.github.io/Laundry-cart-frontend/',
    source: 'https://github.com/Avinash9694/Laundry-cart-frontend',
    featured: false,
    cover: { from: '#a3e635', to: '#166534' },
  },
  {
    slug: '3D-Virtual-Environment',
    title: '3D Virtual Environment',
    tagline: 'A walkable three.js scene with avatars and a third-person camera.',
    description:
      'Pick an avatar and walk a three.js scene with WASD or touch controls, a third-person camera and compressed glTF assets for fast loads.',
    tags: ['three.js', 'WebGL', 'TypeScript', 'Vite'],
    live: 'https://avinash9694.github.io/3D-Virtual-Environment/',
    source: 'https://github.com/Avinash9694/3D-Virtual-Environment',
    featured: false,
    cover: { from: '#c084fc', to: '#1e1b4b' },
  },
  {
    slug: 'Task-Board',
    title: 'Real-time Task Board',
    tagline: 'Trello-style board with drag-and-drop and live presence.',
    description:
      'A collaborative Trello-style board with drag-and-drop columns and cards, and live presence for everyone on the board over Socket.IO, persisted to SQLite.',
    tags: ['React', 'TypeScript', 'Socket.IO', 'SQLite'],
    live: null,
    source: 'https://github.com/Avinash9694/Task-Board',
    featured: false,
    cover: { from: '#94a3b8', to: '#334155' },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const gridProjects = projects.filter((p) => !p.featured);
