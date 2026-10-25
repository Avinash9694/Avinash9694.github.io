export interface Role {
  company: string;
  title: string;
  /** YYYY-MM; `end` is null for the current role. */
  start: string;
  end: string | null;
  note?: string;
  points: string[];
}

export const roles: Role[] = [
  {
    company: 'Promptora.ai',
    title: 'Full-Stack Developer',
    start: '2025-10',
    end: null,
    note: 'client: Tessell',
    points: [
      'Lead contributor to a cross-platform desktop app (Tauri, React, Rust) that scans AWS and Azure accounts, runs compliance audits and executes AI-assisted playbooks.',
      'Built a reusable sign-in library for AWS Cognito and Google OAuth 2.0, including the Google Cloud project setup (OAuth client, consent screen, redirect URIs), secure token storage, and the hand-off from the browser back into the app.',
      'Moved Google sign-in to a server-side code exchange, so the auth code never lands on a local page in the browser.',
      'Replaced the old text inputs across every chat and document screen with one rich-text editor built on Lexical, so Markdown, lists and context selection behave the same everywhere.',
      'Unified the multi-cloud cost and inventory scanners into one generic execution engine.',
      'Built a Rust plugin that runs scripts safely, with strict concurrency limits and safeguards.',
      "Rebuilt usage analytics on DynamoDB so nothing is lost on a bad network. Records are saved offline, sent when the connection returns, and compressed to fit DynamoDB's size limit. Failed, stopped and dropped turns are recorded too.",
      'Built OAuth, ticket creation and alert readers for Jira Cloud, Linear and Slack, including creating a ticket straight from a chat message.',
      'Built the findings workflow: Active, Resolved and Archived views, bulk actions, and a detail view inside the canvas.',
      'Built an internal dashboard for user activity and token usage.',
      'Added indicators that say in plain words whether an answer used live or cached cloud data.',
      'Automated compliance report templates for CIS AWS Benchmark, HIPAA, SOC 2, ISO 27001 and PCI-DSS v4.0.',
      'Use Claude Code for features, unit tests and code reviews, and set up MCP integrations connecting AI assistants to Jira, Linear, Slack and GitHub.',
    ],
  },
  {
    company: 'Patdel Analytics',
    title: 'Software Developer',
    start: '2024-03',
    end: '2025-10',
    points: [
      'Built SEO-friendly, responsive websites for Patdel Analytics and Promax Legal with Next.js, React, TypeScript and Tailwind CSS.',
      'Built patent search and analysis tools, including the Super Headed Patent Landscape Search Tool, with React, Node.js and D3.js charts.',
      'Cut repeated API calls and server load by caching requests with TanStack Query.',
      'Set up AWS Cognito for sign-in, Lambda for serverless workflows and DynamoDB for storage, and containerised the apps with Docker.',
      'Added a rich-text editor to the Drafting Tool and generated PDF reports from web views with Puppeteer.',
      'Added internationalisation with i18next.',
    ],
  },
  {
    company: '10x Academy',
    title: 'Software Development Engineer 1',
    start: '2022-03',
    end: '2023-06',
    points: [
      'Automated operations and mentor payouts with Python (Pandas) scripts and Looker Studio dashboards, cutting manual processing by 80%.',
      "Built test suites with Mocha and Chai that graded students' React and HTML assignments automatically.",
      'Built a React progress tracker that showed students their learning milestones.',
      'Built a decision-tree support flow that answered common student questions on the portal automatically.',
      'Mentored students through HTML, CSS, JavaScript, React and Node.js.',
    ],
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2025-10' -> 'Oct 2025' */
export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const name = MONTHS[(month ?? 0) - 1];
  if (!year || !name) throw new Error(`Bad month: ${yearMonth}`);
  return `${name} ${year}`;
}
