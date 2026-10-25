import { describe, expect, it } from 'vitest';
import { formatMonth, roles } from './experience';

describe('formatMonth', () => {
  it('formats a year and month', () => {
    expect(formatMonth('2025-10')).toBe('Oct 2025');
    expect(formatMonth('2022-03')).toBe('Mar 2022');
  });

  it('rejects malformed input', () => {
    expect(() => formatMonth('2025-13')).toThrow();
    expect(() => formatMonth('October')).toThrow();
  });
});

describe('roles', () => {
  it('runs newest first, with only the first one current', () => {
    roles.forEach((role, i) => {
      expect(role.end === null).toBe(i === 0);
      const next = roles[i + 1];
      if (next) expect(role.start > next.start).toBe(true);
    });
  });

  it('gives every role its points, each a short bullet with no em-dash', () => {
    for (const role of roles) {
      expect(role.points.length, role.company).toBeGreaterThanOrEqual(3);
      for (const point of role.points) {
        expect(point.length, point).toBeLessThanOrEqual(260);
        expect(point).not.toContain('\u2014');
      }
    }
  });
});
