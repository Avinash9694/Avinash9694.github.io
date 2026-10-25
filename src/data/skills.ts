export interface SkillGroup {
  name: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    name: 'Frontend',
    items: [
      'React',
      'TypeScript',
      'Next.js',
      'Tailwind CSS',
      'Lexical',
      'Zustand',
      'TanStack Query',
      'D3.js',
      'three.js',
      'Vite',
    ],
  },
  {
    name: 'Backend & Cloud',
    items: [
      'Node.js',
      'Express',
      'AWS Cognito',
      'AWS Lambda',
      'DynamoDB',
      'CloudWatch',
      'OAuth 2.0',
      'MongoDB',
      'MySQL',
      'SurrealDB',
      'Firebase',
    ],
  },
  {
    name: 'Desktop & Systems',
    items: ['Rust', 'Tauri', 'WebAssembly', 'Python', 'SQLite', 'Socket.IO', 'Server-Sent Events'],
  },
  {
    name: 'Tooling & AI',
    items: [
      'Vitest',
      'Testing Library',
      'GitHub Actions',
      'ESLint & Prettier',
      'Puppeteer',
      'Model Context Protocol',
      'Jira, Linear & Slack APIs',
    ],
  },
];
