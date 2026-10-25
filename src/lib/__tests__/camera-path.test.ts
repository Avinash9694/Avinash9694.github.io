import {
  KEYFRAMES,
  keyframesAreOrdered,
  portraitFov,
  progressToT,
  type Keyframe,
} from '../camera-path';
import { PROJECT_STATIONS, ROLE_STATIONS, sectionFromProgress } from '../progress-map';

const simple: Keyframe[] = [
  { at: 0, position: [0, 0, 0], target: [0, 0, 1] },
  { at: 0.5, position: [1, 0, 0], target: [0, 0, 1] },
  { at: 1, position: [2, 0, 0], target: [0, 0, 1] },
];

describe('progressToT', () => {
  it('hits keyframe i at exactly t = i / (n - 1)', () => {
    expect(progressToT(0, simple)).toBe(0);
    expect(progressToT(0.5, simple)).toBeCloseTo(0.5);
    expect(progressToT(1, simple)).toBe(1);
  });

  it('is linear between keyframes, whatever their spacing', () => {
    const uneven: Keyframe[] = [
      { at: 0, position: [0, 0, 0], target: [0, 0, 0] },
      { at: 0.8, position: [0, 0, 0], target: [0, 0, 0] },
      { at: 1, position: [0, 0, 0], target: [0, 0, 0] },
    ];
    expect(progressToT(0.4, uneven)).toBeCloseTo(0.25);
    expect(progressToT(0.9, uneven)).toBeCloseTo(0.75);
  });

  it('clamps outside [0, 1] and is monotonic', () => {
    expect(progressToT(-0.5)).toBe(0);
    expect(progressToT(1.5)).toBe(1);
    let last = -1;
    for (let p = 0; p <= 1.0001; p += 0.01) {
      const t = progressToT(p);
      expect(t).toBeGreaterThanOrEqual(last);
      last = t;
    }
  });

  it('degenerates gracefully with fewer than two keyframes', () => {
    expect(progressToT(0.5, [])).toBe(0);
    expect(progressToT(0.5, [simple[0]!])).toBe(0);
  });
});

describe('KEYFRAMES', () => {
  it('is strictly ordered from 0 to 1', () => {
    expect(keyframesAreOrdered()).toBe(true);
    expect(KEYFRAMES[0]?.at).toBe(0);
    expect(KEYFRAMES[KEYFRAMES.length - 1]?.at).toBe(1);
    expect(keyframesAreOrdered([simple[1]!, simple[0]!])).toBe(false);
  });

  it('has a camera stop at every role and project station', () => {
    const ats = KEYFRAMES.map((k) => k.at);
    [...ROLE_STATIONS, ...PROJECT_STATIONS].forEach((station) => {
      expect(ats).toContain(station);
    });
  });

  it('settles inside every section', () => {
    const sections = new Set(KEYFRAMES.map((k) => sectionFromProgress(k.at)));
    expect([...sections].sort()).toEqual([0, 1, 2, 3, 4]);
  });

  it('keeps the camera above the island floor', () => {
    KEYFRAMES.forEach((k) => expect(k.position[1]).toBeGreaterThan(1));
  });
});

describe('portraitFov', () => {
  it('keeps the desktop FOV on wide screens and widens on phones', () => {
    expect(portraitFov(1.6)).toBe(38);
    expect(portraitFov(0.46)).toBe(52);
    expect(portraitFov(0.9)).toBeGreaterThan(38);
    expect(portraitFov(0.9)).toBeLessThan(52);
  });
});
