export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  live: string;
  source: string;
  /** Root-relative path under /public, 1200x750. */
  screenshot: string;
  alt: string;
}

export const projects: Project[] = [
  {
    slug: 'iam-policy-analyzer',
    title: 'IAM Policy Analyzer',
    summary:
      "Paste an AWS IAM policy and it tells you what's risky: wildcards, ways to escalate privileges, public access, missing conditions. Each problem comes with a safer version of the statement you can copy. It runs entirely in your browser.",
    tags: ['React', 'TypeScript', 'AWS IAM', 'Security'],
    live: 'https://avinash9694.github.io/iam-policy-analyzer/',
    source: 'https://github.com/Avinash9694/iam-policy-analyzer',
    screenshot: '/screenshots/iam-policy-analyzer.webp',
    alt: 'IAM Policy Analyzer showing a pasted policy on the left and a ranked list of risky statements on the right.',
  },
  {
    slug: 'cloud-audit-mcp',
    title: 'Cloud Audit MCP Server',
    summary:
      'Lets Claude or Cursor check an AWS account for common security problems through read-only tools. It ships with sample data, so you can try it without credentials.',
    tags: ['TypeScript', 'Node.js', 'MCP', 'AWS SDK v3'],
    live: 'https://avinash9694.github.io/cloud-audit-mcp/',
    source: 'https://github.com/Avinash9694/cloud-audit-mcp',
    screenshot: '/screenshots/cloud-audit-mcp.webp',
    alt: 'The Cloud Audit MCP Server documentation page, with install instructions and a sample conversation.',
  },
  {
    slug: 'sse-stream-inspector',
    title: 'SSE Stream Inspector',
    summary:
      'A debugger for the event streams chat backends send. I built it after an event that was quietly renamed in one place cost me a day.',
    tags: ['React', 'TypeScript', 'Server-Sent Events', 'Web Workers'],
    live: 'https://avinash9694.github.io/sse-stream-inspector/',
    source: 'https://github.com/Avinash9694/sse-stream-inspector',
    screenshot: '/screenshots/sse-stream-inspector.webp',
    alt: 'SSE Stream Inspector showing a captured stream as a timeline of events, with one event open for inspection.',
  },
  {
    slug: 'iac-diff-viewer',
    title: 'IaC Diff Viewer',
    summary:
      'Compares two CloudFormation or Terraform files resource by resource and points out the risky changes, like a database being removed.',
    tags: ['Rust', 'WebAssembly', 'React', 'Terraform'],
    live: 'https://avinash9694.github.io/iac-diff-viewer/',
    source: 'https://github.com/Avinash9694/iac-diff-viewer',
    screenshot: '/screenshots/iac-diff-viewer.webp',
    alt: 'IaC Diff Viewer listing changed resources grouped by risk, with a removed database selected.',
  },
  {
    slug: 'task-board',
    title: 'Real-time Task Board',
    summary:
      'A Trello-style board with drag-and-drop columns and cards. Everyone on the board sees changes and who is online as they happen. Open it in two tabs to watch it update live.',
    tags: ['React', 'TypeScript', 'Socket.IO', 'SQLite'],
    live: 'https://avinash9694.github.io/Task-Board/',
    source: 'https://github.com/Avinash9694/Task-Board',
    screenshot: '/screenshots/Task-Board.webp',
    alt: 'The Task Board with three columns of cards and a row of online avatars.',
  },
  {
    slug: 'northline',
    title: 'Northline',
    summary:
      "A full e-commerce app with an Express and MongoDB backend. The demo runs entirely in your browser, so there's no server to wait for.",
    tags: ['React', 'TypeScript', 'Express', 'MongoDB'],
    live: 'https://avinash9694.github.io/Ecommerce-APP/',
    source: 'https://github.com/Avinash9694/Ecommerce-APP',
    screenshot: '/screenshots/Ecommerce-APP.webp',
    alt: 'The Northline storefront home page, with featured products and shopping categories.',
  },
  {
    slug: 'laundry-cart',
    title: 'Laundry Cart',
    summary:
      'Ordering for a laundry service. You pick garments and wash types, see the price as you go, and then follow the order from pickup to delivery. The API lives in a separate repo.',
    tags: ['React', 'TypeScript', 'TanStack Query', 'Express'],
    live: 'https://avinash9694.github.io/Laundry-cart-frontend/',
    source: 'https://github.com/Avinash9694/Laundry-cart-frontend',
    screenshot: '/screenshots/Laundry-cart-frontend.webp',
    alt: 'The Laundry Cart dashboard, showing orders in progress, total spent and recent orders.',
  },
  {
    slug: 'taste-of-india-hub',
    title: 'Taste of India Hub',
    summary:
      'A recipe site for Indian home cooking. You can search by ingredient, filter by region and diet, and tick off ingredients as you cook. I first built it in 2023 and rebuilt it properly this year.',
    tags: ['React', 'TypeScript', 'Firebase Auth', 'Tailwind CSS'],
    live: 'https://avinash9694.github.io/TasteOfIndiaHub/',
    source: 'https://github.com/Avinash9694/TasteOfIndiaHub',
    screenshot: '/screenshots/TasteOfIndiaHub.webp',
    alt: 'The Taste of India Hub home page, with a large heading and a grid of dish photos.',
  },
  {
    slug: '3d-virtual-environment',
    title: '3D Virtual Environment',
    summary:
      'A small three.js world you can walk around in as one of three characters, with the keyboard or a touch joystick. Mostly an excuse to learn WebGL properly.',
    tags: ['three.js', 'TypeScript', 'WebGL', 'glTF'],
    live: 'https://avinash9694.github.io/3D-Virtual-Environment/',
    source: 'https://github.com/Avinash9694/3D-Virtual-Environment',
    screenshot: '/screenshots/3D-Virtual-Environment.webp',
    alt: 'A robot avatar standing in a paved plaza with trees, houses and a cutaway room.',
  },
];

export const PROJECT_COUNT = projects.length;
