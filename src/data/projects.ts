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
  /** Root-relative path under /public. Rendered over the cover gradient when present. */
  screenshot?: string;
}

export const projects: Project[] = [
  {
    slug: 'iam-policy-analyzer',
    title: 'IAM Policy Analyzer',
    tagline: 'Ranked security findings for any AWS IAM policy, entirely in the browser.',
    description:
      'Paste an AWS IAM policy and get ranked findings from 13 rules: wildcard actions and resources, privilege-escalation paths such as iam:PassRole with lambda:CreateFunction, missing conditions and NotAction pitfalls, each with a copyable fixed statement and a Deny-based mitigation. A position-tracking JSON parser highlights the offending lines, a 0–100 risk score summarises the policy, and results travel as compressed shareable links. Runs entirely client-side; 112 tests.',
    tags: ['React', 'TypeScript', 'AWS IAM', 'Security', 'Static analysis', 'Vitest'],
    live: 'https://avinash9694.github.io/iam-policy-analyzer/',
    source: 'https://github.com/Avinash9694/iam-policy-analyzer',
    featured: true,
    cover: { from: '#7c6cff', to: '#3b2fb5' },
    screenshot: '/screenshots/iam-policy-analyzer.webp',
  },
  {
    slug: 'cloud-audit-mcp',
    title: 'Cloud Audit MCP Server',
    tagline: 'Read-only AWS posture checks exposed as Model Context Protocol tools.',
    description:
      'A TypeScript Model Context Protocol server exposing 14 read-only AWS checks across S3, EC2, RDS, IAM and CloudTrail as six Zod-validated tools, plus resources and a security-review prompt, to Claude Desktop, Claude Code and Cursor. A fixture mode runs with no credentials, and a test enforces that only List, Describe and Get SDK commands are ever imported. 99 tests plus a stdio smoke test; the docs site runs the real checks in-browser.',
    tags: ['TypeScript', 'Model Context Protocol', 'AWS SDK v3', 'Zod', 'Vitest'],
    live: 'https://avinash9694.github.io/cloud-audit-mcp/',
    source: 'https://github.com/Avinash9694/cloud-audit-mcp',
    featured: true,
    cover: { from: '#2dd4bf', to: '#1e3a8a' },
    screenshot: '/screenshots/cloud-audit-mcp.webp',
  },
  {
    slug: 'sse-stream-inspector',
    title: 'SSE Stream Inspector',
    tagline: 'Record, replay and diagnose Server-Sent Events frame by frame.',
    description:
      'A spec-compliant streaming parser for Server-Sent Events with diagnostics for the failures that bite in production: the same event sent under two spellings with different payload shapes, shape drift, duplicate or regressing ids, long silences and a missing terminal frame. Paste a capture, fetch live or import a HAR, then replay with the original timing. Parsing runs in a Web Worker and the timeline is virtualised, so 10k frames stay smooth; 107 tests.',
    tags: ['React', 'TypeScript', 'Server-Sent Events', 'Web Workers', 'Vitest'],
    live: 'https://avinash9694.github.io/sse-stream-inspector/',
    source: 'https://github.com/Avinash9694/sse-stream-inspector',
    featured: false,
    cover: { from: '#f472b6', to: '#7c3aed' },
    screenshot: '/screenshots/sse-stream-inspector.webp',
  },
  {
    slug: 'iac-diff-viewer',
    title: 'IaC Diff Viewer',
    tagline: 'Resource-level diffs of CloudFormation and Terraform, with risk tags.',
    description:
      'A Rust diff engine compiled to a 300 KB WebAssembly module that auto-detects CloudFormation (JSON or YAML, short-form intrinsics included), Terraform plans and Terraform state. It produces a resource-level structural diff with LCS arrays, set-like fields and rename detection, tags each change with a risk level and a plain-English reason, and exports to Markdown. 91 Rust and 24 TypeScript tests.',
    tags: ['Rust', 'WebAssembly', 'React', 'TypeScript', 'Terraform', 'CloudFormation'],
    live: 'https://avinash9694.github.io/iac-diff-viewer/',
    source: 'https://github.com/Avinash9694/iac-diff-viewer',
    featured: false,
    cover: { from: '#fb923c', to: '#9f1239' },
    screenshot: '/screenshots/iac-diff-viewer.webp',
  },
  {
    slug: 'TasteOfIndiaHub',
    title: 'Taste of India Hub',
    tagline: 'Recipe discovery with faceted search and persistent checklists.',
    description:
      'Recipe discovery rebuilt from Create React App to Vite, React 18 and TypeScript: 18 fully specified recipes from six chefs, ingredient search with chef, region, diet and difficulty facets over Zod-validated data, and ingredient checklists that persist between visits. Firebase email and password auth is lazy-loaded and degrades gracefully when unavailable; images go through a WebP pipeline. 46 tests.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Firebase Auth', 'Zod'],
    live: 'https://avinash9694.github.io/TasteOfIndiaHub/',
    source: 'https://github.com/Avinash9694/TasteOfIndiaHub',
    featured: false,
    cover: { from: '#facc15', to: '#c2410c' },
    screenshot: '/screenshots/TasteOfIndiaHub.webp',
  },
  {
    slug: 'Ecommerce-APP',
    title: 'Northline',
    tagline: 'Full-stack e-commerce that runs entirely in the browser on GitHub Pages.',
    description:
      'An Express and MongoDB API with JWT auth, Zod-validated routes, paginated search, stock-enforcing carts, an order status machine and an admin role, behind a React storefront. The data layer is one interface with two implementations, an HTTP client and an in-browser demo adapter, so the storefront runs fully on GitHub Pages with URL-synced filters, an optimistic cart with rollback, two-step checkout with mock payment and an admin console. 133 tests.',
    tags: ['React', 'TypeScript', 'Express', 'MongoDB', 'TanStack Query', 'Tailwind CSS'],
    live: 'https://avinash9694.github.io/Ecommerce-APP/',
    source: 'https://github.com/Avinash9694/Ecommerce-APP',
    featured: false,
    cover: { from: '#38bdf8', to: '#0f766e' },
    screenshot: '/screenshots/Ecommerce-APP.webp',
  },
  {
    slug: 'Laundry-cart-frontend',
    title: 'Laundry Cart',
    tagline: 'Order management for a laundry service, from wizard to status timeline.',
    description:
      'A four-step garment and wash-type order wizard with a live price breakdown, then order history with a status timeline, filters, pagination and cancellation. One data-access interface is backed by the real API or an in-browser demo adapter; the Express and Mongoose API owns pricing, Zod validation and the admin status-transition table. 100 tests across both repositories.',
    tags: ['React', 'TypeScript', 'TanStack Query', 'Express', 'MongoDB', 'Vitest'],
    live: 'https://avinash9694.github.io/Laundry-cart-frontend/',
    source: 'https://github.com/Avinash9694/Laundry-cart-frontend',
    featured: false,
    cover: { from: '#a3e635', to: '#166534' },
    screenshot: '/screenshots/Laundry-cart-frontend.webp',
  },
  {
    slug: '3D-Virtual-Environment',
    title: '3D Virtual Environment',
    tagline: 'A walkable three.js scene with avatars and a spring third-person camera.',
    description:
      'Three animated avatars, a WASD and touch third-person controller with a spring camera, and a procedurally generated plaza. The original 35 MB scene was compressed to 486 KB with glTF and meshopt and stands as a cutaway landmark you can walk through; quality presets keep it smooth on modest hardware. 59 tests.',
    tags: ['three.js', 'TypeScript', 'WebGL', 'glTF / meshopt', 'Vite'],
    live: 'https://avinash9694.github.io/3D-Virtual-Environment/',
    source: 'https://github.com/Avinash9694/3D-Virtual-Environment',
    featured: false,
    cover: { from: '#c084fc', to: '#1e1b4b' },
    screenshot: '/screenshots/3D-Virtual-Environment.webp',
  },
  {
    slug: 'Task-Board',
    title: 'Real-time Task Board',
    tagline: 'Trello-style board with drag-and-drop and live presence.',
    description:
      'A collaborative Trello-style board with drag-and-drop columns and cards, and live presence for everyone on the board over Socket.IO, persisted to SQLite. There is no hosted demo because it needs a long-lived socket server, so the code is the demo.',
    tags: ['React', 'TypeScript', 'Socket.IO', 'SQLite'],
    live: null,
    source: 'https://github.com/Avinash9694/Task-Board',
    featured: false,
    cover: { from: '#94a3b8', to: '#334155' },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const gridProjects = projects.filter((p) => !p.featured);
