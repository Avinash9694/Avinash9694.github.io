export interface Role {
  company: string;
  title: string;
  period: string;
  meta?: string;
  bullets: string[];
}

export const roles: Role[] = [
  {
    company: 'Promptora.ai',
    title: 'Software Developer',
    period: 'Oct 2025 — Present',
    meta: 'Client: Tessell · Hyderabad',
    bullets: [
      'Lead contributor to a cross-platform cloud-operations desktop app (Tauri, React, Rust) that automates AWS and Azure estate scanning, compliance audits and AI-assisted playbook execution.',
      'Built a reusable authentication library for AWS Cognito and Google OAuth 2.0: secure token storage, a return path from the browser to the desktop app, and a server-side code exchange for Google sign-in.',
      'Replaced legacy text inputs across every chat and document surface with a custom Lexical rich-text composer, standardising Markdown parsing, lists and context selection.',
      'Unified multi-cloud cost and inventory scanners into one generic execution engine, and built a Rust plugin for safe script execution with strict concurrency limits.',
      'Rebuilt usage telemetry on DynamoDB so nothing is lost on unstable networks: records are staged offline, replayed on reconnect and compressed to fit item-size limits. Failed, stopped and dropped turns are recorded too.',
      'Shipped OAuth, ticket creation and alert readers for Jira Cloud, Linear and Slack, including tickets raised straight from chat messages.',
      'Built the findings workflow (Active, Resolved and Archived views, bulk actions, an in-canvas detail view) and an internal dashboard for user activity and token usage.',
      'Added data-provenance indicators that state in words whether an answer used live or cached cloud data, and automated compliance report templates for CIS AWS Benchmark, HIPAA, SOC 2, ISO 27001 and PCI-DSS v4.0.',
      'Built MCP integrations connecting AI assistants to Jira, Linear, Slack and GitHub.',
    ],
  },
  {
    company: 'Patdel Analytics',
    title: 'Software Developer',
    period: 'Mar 2024 — Oct 2025',
    bullets: [
      'Designed and built SEO-friendly, responsive websites for Patdel Analytics and Promax Legal Business with Next.js and Tailwind CSS.',
      'Built features for Patdel Analytics Tools, including automated patent-search interfaces and the Super Headed Patent Landscape Search Tool, with React, Node.js and D3.js data visualisations.',
      'Introduced TanStack Query caching, cutting redundant API calls and speeding up data fetching.',
      'Integrated a rich-text editor into the Drafting Tool and automated PDF report generation with Puppeteer on Node.js.',
    ],
  },
  {
    company: '10x Academy',
    title: 'Software Development Engineer 1',
    period: 'Mar 2022 — Jun 2023',
    bullets: [
      'Wrote Chai and Mocha test suites that automatically evaluated React and HTML assignments.',
      'Automated mentor payments with a Python and Pandas script.',
      'Built a decision-tree framework that gave students automated support and guidance on the student portal.',
      'Automated bootcamp data analysis with Looker Studio.',
      'Mentored students through the fundamentals of HTML, CSS, JavaScript, React and Node.js.',
    ],
  },
];
