import { formatMonth, formatRange, roleYear, roles } from '../experience';
import { PROJECT_COUNT, projects } from '../projects';
import { SECTIONS, hackathon, intro, site } from '../site';

const NO_EM_DASH = /—/;

describe('projects', () => {
  it('lists nine projects with unique slugs and real links', () => {
    expect(PROJECT_COUNT).toBe(9);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(9);
    projects.forEach((p) => {
      expect(p.live).toMatch(/^https:\/\//);
      expect(p.source).toMatch(/^https:\/\/github\.com\/Avinash9694\//);
      expect(p.screenshot).toMatch(/^\/screenshots\/.+\.webp$/);
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.summary).not.toMatch(NO_EM_DASH);
      expect(p.alt.length).toBeGreaterThan(10);
    });
  });

  it('links the live Task Board', () => {
    const board = projects.find((p) => p.slug === 'task-board');
    expect(board?.live).toBe('https://avinash9694.github.io/Task-Board/');
    expect(board?.screenshot).toBe('/screenshots/Task-Board.webp');
  });
});

describe('experience', () => {
  it('runs oldest to newest, ending at the current role', () => {
    expect(roles.map((r) => r.company)).toEqual([
      '10x Academy',
      'Patdel Analytics',
      'Promptora.ai',
    ]);
    expect(roles[roles.length - 1]?.end).toBeNull();
    expect(roles[roles.length - 1]?.title).toBe('Full-Stack Developer (client: Tessell)');
    for (let i = 1; i < roles.length; i++) {
      expect(roles[i]!.start > roles[i - 1]!.start).toBe(true);
    }
  });

  it('keeps every bullet as one plain sentence block', () => {
    roles.forEach((role) => {
      expect(role.points.length).toBeGreaterThanOrEqual(5);
      role.points.forEach((point) => {
        expect(point.trim()).toBe(point);
        expect(point).not.toMatch(NO_EM_DASH);
      });
    });
    expect(roles.reduce((n, r) => n + r.points.length, 0)).toBe(24);
  });

  it('formats months and ranges', () => {
    expect(formatMonth('2025-10')).toBe('Oct 2025');
    expect(formatRange({ start: '2022-03', end: '2023-06' })).toBe('Mar 2022 to Jun 2023');
    expect(formatRange({ start: '2025-10', end: null })).toBe('Oct 2025 to now');
    expect(roleYear({ start: '2024-03' })).toBe('2024');
    expect(() => formatMonth('nope')).toThrow();
  });
});

describe('site', () => {
  it('keeps the resume path and contact links stable', () => {
    expect(site.resume).toBe('/Avinash_Sahu_Resume.pdf');
    expect(site.email).toBe('avinashsahu1994@gmail.com');
    expect(site.github).toBe('https://github.com/Avinash9694');
    expect(site.linkedin).toBe('https://www.linkedin.com/in/A-v-i-n-a-s-h/');
    expect(site.stack).toEqual(['React', 'TypeScript', 'Node.js', 'Python', 'AWS']);
  });

  it('has five sections in order and plain copy', () => {
    expect(SECTIONS.map((s) => s.id)).toEqual([
      'hero',
      'about',
      'experience',
      'projects',
      'contact',
    ]);
    [...intro, hackathon].forEach((line) => expect(line).not.toMatch(NO_EM_DASH));
    expect(hackathon).toBe('My team placed first overall in a company-wide hackathon at Tessell.');
  });
});
