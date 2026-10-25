import { describe, expect, it } from 'vitest';
import { buildGraph, projects, techs, workAnchor } from './graph';

describe('projects', () => {
  it('has unique slugs', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });

  it('has exactly one featured project, with an image', () => {
    const featured = projects.filter((p) => p.tier === 'featured');
    expect(featured).toHaveLength(1);
    expect(featured[0]?.image?.src).toMatch(/^\/screenshots\/.+\.webp$/);
  });

  it('gives every older project a phrase for the closing line', () => {
    for (const p of projects.filter((q) => q.tier === 'older')) expect(p.phrase).toBeTruthy();
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

  it('points project nodes at their Work entry', () => {
    for (const p of projects) {
      const node = graph.nodes.find((n) => n.id === p.slug);
      expect(node?.anchor).toBe(workAnchor(p));
    }
    expect(workAnchor({ slug: 'x', tier: 'older' })).toBe('older-work');
  });
});
