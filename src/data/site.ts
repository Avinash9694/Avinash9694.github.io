export const site = {
  name: 'Avinash Sahu',
  title: 'Software Developer',
  tagline: 'React, TypeScript, Node.js, AWS',
  location: 'Hyderabad, India',
  email: 'avinashsahu1994@gmail.com',
  github: 'https://github.com/Avinash9694',
  linkedin: 'https://www.linkedin.com/in/A-v-i-n-a-s-h/',
  resume: '/Avinash_Sahu_Resume.pdf',
  url: 'https://avinash9694.github.io',
} as const;

export interface NavItem {
  id: string;
  label: string;
}

export const navItems: NavItem[] = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];
