import { degradeTier, pickTier, readTierOverride, type DeviceSignals } from '../device-tier';

const desktop: DeviceSignals = {
  webgl: true,
  webgl2: true,
  finePointer: true,
  cores: 8,
  saveData: false,
  reducedMotion: false,
};

describe('pickTier', () => {
  it('gives a capable desktop the high tier', () => {
    expect(pickTier(desktop)).toBe('high');
  });

  it('drops to medium without WebGL2, a mouse or enough cores', () => {
    expect(pickTier({ ...desktop, webgl2: false })).toBe('medium');
    expect(pickTier({ ...desktop, finePointer: false, cores: 8 })).toBe('medium');
    expect(pickTier({ ...desktop, cores: 4 })).toBe('medium');
  });

  it('never draws a canvas without WebGL, with data saver or with reduced motion', () => {
    expect(pickTier({ ...desktop, webgl: false, webgl2: false })).toBe('low');
    expect(pickTier({ ...desktop, saveData: true })).toBe('low');
    expect(pickTier({ ...desktop, reducedMotion: true })).toBe('low');
  });

  it('treats a small touch device as low', () => {
    expect(pickTier({ ...desktop, finePointer: false, cores: 4 })).toBe('low');
    expect(pickTier({ ...desktop, finePointer: false, cores: 2 })).toBe('low');
  });
});

describe('readTierOverride', () => {
  it('accepts the three tiers and nothing else', () => {
    expect(readTierOverride('?tier=high')).toBe('high');
    expect(readTierOverride('?x=1&tier=low')).toBe('low');
    expect(readTierOverride('?tier=ultra')).toBeNull();
    expect(readTierOverride('')).toBeNull();
  });
});

describe('degradeTier', () => {
  it('steps high down to medium and leaves the rest alone', () => {
    expect(degradeTier('high')).toBe('medium');
    expect(degradeTier('medium')).toBe('medium');
    expect(degradeTier('low')).toBe('low');
  });
});
