import { describe, expect, it } from 'vitest';
import { cameraPosition, fieldOfView, fitHalfExtent, project, type View } from './projection';

const view: View = { distance: 4, elevation: 0, halfExtent: 1.5 };

describe('project', () => {
  it('maps the origin to the centre', () => {
    const p = project([0, 0, 0], view);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(0);
    expect(p.depth).toBeCloseTo(4);
  });

  it('keeps x to the right and flips y for screen space', () => {
    const p = project([1, 1, 0], view);
    expect(p.x).toBeCloseTo(1);
    expect(p.y).toBeCloseTo(-1);
  });

  it('enlarges points nearer the camera', () => {
    expect(project([1, 0, 1], view).x).toBeGreaterThan(project([1, 0, -1], view).x);
  });

  it('agrees with the camera position when elevated', () => {
    const v = { ...view, elevation: 0.5 };
    const cam = cameraPosition(v);
    expect(Math.hypot(...cam)).toBeCloseTo(4);
    // The point directly below the camera on the ground plane projects below centre.
    expect(project([0, 0, 1], v).y).toBeGreaterThan(0);
  });
});

describe('fitHalfExtent', () => {
  it('leaves room for a node at full radius nearest the camera', () => {
    const h = fitHalfExtent(1, 4, 1);
    expect(h).toBeCloseTo(4 / 3);
    expect(Math.abs(project([1, 0, 0.0001], view).x)).toBeLessThan(h);
  });
});

describe('fieldOfView', () => {
  it('fits the square to the height of a wide canvas', () => {
    const fov = fieldOfView(view, 800, 400);
    expect(Math.tan(((fov / 2) * Math.PI) / 180)).toBeCloseTo(1.5 / 4);
  });

  it('widens the vertical angle on a tall canvas so the square fits the width', () => {
    expect(fieldOfView(view, 300, 600)).toBeGreaterThan(fieldOfView(view, 600, 600));
  });
});
