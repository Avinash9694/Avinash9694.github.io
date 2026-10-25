import { describe, expect, it } from 'vitest';
import { shouldRender3D, type DeviceSignals } from './render-3d';

const capable: DeviceSignals = {
  reducedMotion: false,
  webgl: true,
  saveData: false,
  cores: 8,
  coarsePointer: false,
};

describe('shouldRender3D', () => {
  it('renders on a capable device', () => {
    expect(shouldRender3D(capable)).toBe(true);
  });

  it.each([
    ['reduced motion', { reducedMotion: true }],
    ['no WebGL', { webgl: false }],
    ['data saver', { saveData: true }],
    ['a low-end touch device', { cores: 4, coarsePointer: true }],
  ])('keeps the drawing for %s', (_, change) => {
    expect(shouldRender3D({ ...capable, ...change })).toBe(false);
  });

  it('still renders on a 4-core laptop with a mouse', () => {
    expect(shouldRender3D({ ...capable, cores: 4 })).toBe(true);
  });

  it('still renders on touch devices that do not report their cores', () => {
    expect(shouldRender3D({ ...capable, cores: undefined, coarsePointer: true })).toBe(true);
  });
});
