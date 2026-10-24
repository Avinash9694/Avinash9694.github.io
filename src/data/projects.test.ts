import { describe, expect, it } from 'vitest';
import { featuredProjects, gridProjects, projects } from './projects';

const HEX = /^#[0-9a-f]{6}$/i;

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

describe('projects data', () => {
  it('lists every project exactly once by slug', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.length).toBeGreaterThanOrEqual(9);
  });

  it('has a valid https source URL on every project', () => {
    for (const project of projects) {
      expect(isHttpsUrl(project.source), `${project.slug} source`).toBe(true);
      expect(project.source).toMatch(/^https:\/\/github\.com\/Avinash9694\//);
    }
  });

  it('has a valid https live URL where a live demo exists', () => {
    for (const project of projects) {
      if (project.live === null) continue;
      expect(isHttpsUrl(project.live), `${project.slug} live`).toBe(true);
      expect(project.live.endsWith('/'), `${project.slug} live ends with /`).toBe(true);
    }
  });

  it('marks exactly two projects as featured and keeps the rest in the grid', () => {
    expect(featuredProjects).toHaveLength(2);
    expect(featuredProjects.length + gridProjects.length).toBe(projects.length);
  });

  it('gives every project copy, tags and a two-stop cover gradient', () => {
    for (const project of projects) {
      expect(project.title.trim().length).toBeGreaterThan(0);
      expect(project.tagline.trim().length).toBeGreaterThan(0);
      expect(project.description.trim().length).toBeGreaterThan(40);
      expect(project.tags.length).toBeGreaterThanOrEqual(3);
      expect(new Set(project.tags).size).toBe(project.tags.length);
      expect(project.cover.from).toMatch(HEX);
      expect(project.cover.to).toMatch(HEX);
    }
  });

  it('points any screenshot at a root-relative public asset', () => {
    for (const project of projects) {
      if (project.screenshot === undefined) continue;
      expect(project.screenshot.startsWith('/')).toBe(true);
    }
  });
});
