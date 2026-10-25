export const site = {
  name: 'Avinash Sahu',
  firstName: 'Avinash',
  lastName: 'Sahu',
  role: 'Software developer',
  location: 'Hyderabad',
  stack: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  email: 'avinashsahu1994@gmail.com',
  github: 'https://github.com/Avinash9694',
  linkedin: 'https://www.linkedin.com/in/A-v-i-n-a-s-h/',
  /** Linked from an old domain that redirects here; the path must not change. */
  resume: '/Avinash_Sahu_Resume.pdf',
  source: 'https://github.com/Avinash9694/Avinash9694.github.io',
  url: 'https://avinash9694.github.io',
  photo: '/avinash.webp',
} as const;

export const intro = [
  "I'm Avinash, a software developer in Hyderabad. I've spent the last four years building web and desktop apps with React, TypeScript and Node.js, mostly on AWS. I also write Python, mostly for automation and data work.",
  "At Promptora I work on a desktop app for Tessell that scans AWS and Azure accounts, flags problems and helps fix them. I've built its sign-in, its rich-text editor, its usage telemetry, and its Jira, Linear and Slack integrations.",
  "I'm looking for a senior frontend or full-stack role.",
] as const;

export const hackathon = 'My team placed first overall in a company-wide hackathon at Tessell.';

export const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
export const SECTION_COUNT = SECTIONS.length;
