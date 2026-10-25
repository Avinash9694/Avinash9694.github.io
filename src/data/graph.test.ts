import { describe, expect, it } from 'vitest';
import { buildGraph, projectAnchor, projects, techs } from './graph';

const shippedScreenshots = new Set(
  Object.keys(import.meta.glob('../../public/screenshots/*.webp')).map((path) =>
    path.replace('../../public', ''),
  ),
);

describe('projects', () => {
  it('has unique slugs', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });

  it('gives every project a screenshot that exists', () => {
    for (const p of projects) {
      expect(p.image.src, p.slug).toMatch(/^\/screenshots\/.+\.webp$/);
      expect(shippedScreenshots.has(p.image.src), p.image.src).toBe(true);
      expect(p.image.alt.length, p.slug).toBeGreaterThan(20);
    }
  });

  it('links to Pages demos and GitHub sources', () => {
    for (const p of projects) {
      expect(p.live).toMatch(/^https:\/\/avinash9694\.github\.io\/.+\/$/);
      expect(p.code).toMatch(/^https:\/\/github\.com\/Avinash9694\/.+/);
    }
  });
});

describe('buildGraph', () => {
  const graph = buildGraph();

  it('has a node for every project and every technology', () => {
    expect(graph.nodes).toHaveLength(projects.length + Object.keys(techs).length);
  });

  it('only connects projects to technologies', () => {
    for (const [a, b] of graph.edges) {
      expect(graph.nodes[a]?.kind).toBe('project');
      expect(graph.nodes[b]?.kind).toBe('tech');
    }
  });

  it('uses every technology at least once', () => {
    const used = new Set(graph.edges.map(([, b]) => b));
    graph.nodes.forEach((n, i) => {
      if (n.kind === 'tech') expect(used.has(i), n.label).toBe(true);
    });
  });

  it('points project nodes at their Projects entry', () => {
    for (const p of projects) {
      const node = graph.nodes.find((n) => n.id === p.slug);
      expect(node?.anchor).toBe(projectAnchor(p));
    }
    expect(projectAnchor({ slug: 'x' })).toBe('project-x');
  });
});
