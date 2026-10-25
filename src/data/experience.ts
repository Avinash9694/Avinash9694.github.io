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
    title: 'Software Developer',
    start: '2025-10',
    end: null,
    note: 'client: Tessell',
    points: [
      'Built sign-in with AWS Cognito and Google, including the hand-off from the browser back to the desktop app.',
      'Rebuilt usage telemetry on DynamoDB so records survive a bad connection. They are kept on the device and sent once the network is back.',
      'Wrote a Rust plugin that runs cloud scripts safely, with a hard limit on how many run at once.',
      'Replaced every chat input in the app with one rich-text editor, so lists and formatting behave the same everywhere.',
    ],
  },
  {
    company: 'Patdel Analytics',
    title: 'Software Developer',
    start: '2024-03',
    end: '2025-10',
    points: [
      'Built patent search tools in React and Node.js, with charts drawn in D3.js.',
      'Cut repeated API calls by adding request caching with TanStack Query.',
      'Added a rich-text editor to the drafting tool and generated its PDF reports automatically.',
      'Built the Patdel Analytics and Promax Legal websites in Next.js, with search engines in mind.',
    ],
  },
  {
    company: '10x Academy',
    title: 'Software Development Engineer 1',
    start: '2022-03',
    end: '2023-06',
    points: [
      "Wrote test suites that graded students' React and HTML assignments automatically.",
      'Automated mentor payments with a Python script.',
      'Mentored students learning JavaScript, React and Node.js.',
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
