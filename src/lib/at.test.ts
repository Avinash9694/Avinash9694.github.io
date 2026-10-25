import { describe, expect, it } from 'vitest';
import { at } from './at';

describe('at', () => {
  it('returns the item at an index', () => {
    expect(at(['a', 'b'], 1)).toBe('b');
  });

  it('throws past the end instead of returning undefined', () => {
    expect(() => at(['a'], 1)).toThrow(RangeError);
  });
});
