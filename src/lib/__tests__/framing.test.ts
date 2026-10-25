import {
  framingFor,
  heroFrameScale,
  isMobileLayout,
  LAYOUT,
  panelWidth,
  railReserve,
  rectsOverlap,
} from '../framing';

describe('framingFor', () => {
  it('puts the subject right of a left-hand card on desktop', () => {
    for (const section of [1, 3, 4]) {
      const f = framingFor(section, 1440, 900);
      expect(f.x).toBeGreaterThan(0.08);
      expect(f.y).toBe(0);
    }
  });

  it('keeps the free region clear of the card and the rail', () => {
    for (const [width, height] of [
      [1440, 900],
      [1024, 768],
    ] as const) {
      const f = framingFor(3, width, height);
      const centre = width / 2 + f.x * width;
      expect(centre - f.freeWidth / 2).toBeGreaterThan(panelWidth('projects', width));
      expect(centre + f.freeWidth / 2).toBeLessThanOrEqual(width - railReserve(width) + 0.001);
    }
  });

  it('drops the rail labels below 1200px, giving the subject that room back', () => {
    expect(railReserve(1440)).toBe(LAYOUT.railWithLabels);
    expect(railReserve(1024)).toBe(LAYOUT.railTicksOnly);
  });

  it('zooms close-ups out when the free space is narrow', () => {
    expect(framingFor(1, 1440, 900).zoom).toBeCloseTo(1, 1);
    expect(framingFor(1, 1024, 768).zoom).toBeLessThan(0.9);
    expect(framingFor(1, 390, 844).zoom).toBeLessThan(0.7);
    expect(framingFor(3, 1024, 768).zoom).toBe(1);
    for (const section of [0, 1, 2, 3, 4]) {
      expect(framingFor(section, 1024, 768).zoom).toBeGreaterThanOrEqual(0.55);
    }
  });

  it('puts the subject left of the right-hand experience card', () => {
    expect(framingFor(2, 1440, 900).x).toBeLessThan(-0.15);
    expect(framingFor(2, 1024, 768).x).toBeLessThan(-0.2);
  });

  it('lifts the hero so the island clears the overlay at the bottom', () => {
    expect(framingFor(0, 1440, 900)).toMatchObject({ x: 0, y: LAYOUT.heroLiftDesktop, zoom: 1 });
  });

  it('stacks everything vertically on phones, above the bottom card', () => {
    expect(isMobileLayout(390)).toBe(true);
    expect(isMobileLayout(1024)).toBe(false);
    for (const section of [1, 2, 3, 4]) {
      expect(framingFor(section, 390, 844)).toMatchObject({ x: 0, y: LAYOUT.mobileLift });
    }
  });

  it('clamps out-of-range sections', () => {
    expect(framingFor(-3, 1440, 900)).toEqual(framingFor(0, 1440, 900));
    expect(framingFor(9, 1440, 900)).toEqual(framingFor(4, 1440, 900));
  });
});

describe('heroFrameScale', () => {
  const frame = { width: 1.56, height: 0.975 };

  it('shrinks the frame to the free width', () => {
    const wide = heroFrameScale({ freeWidth: 700, freeHeight: 700 }, 900, 38, 3.9, frame);
    const narrow = heroFrameScale({ freeWidth: 300, freeHeight: 700 }, 900, 38, 3.9, frame);
    expect(narrow).toBeLessThan(wide);
  });

  it('never exceeds the cap or drops below a visible size', () => {
    expect(heroFrameScale({ freeWidth: 5000, freeHeight: 5000 }, 900, 38, 3.9, frame)).toBe(1.15);
    expect(heroFrameScale({ freeWidth: 1, freeHeight: 1 }, 900, 38, 3.9, frame)).toBe(0.2);
  });

  it('fills about 86% of the free width when width is the limit', () => {
    const scale = heroFrameScale({ freeWidth: 600, freeHeight: 2000 }, 900, 38, 3.9, frame);
    const pxPerUnit = 900 / (2 * 3.9 * Math.tan((38 * Math.PI) / 360));
    expect(scale * frame.width * pxPerUnit).toBeCloseTo(600 * 0.86, 0);
  });
});

describe('rectsOverlap', () => {
  const hero = { x: 0.2, y: 0, halfW: 0.3, halfH: 0.2 };

  it('detects overlap and clearance', () => {
    expect(rectsOverlap({ x: 0.5, y: 0.1, halfW: 0.1, halfH: 0.1 }, hero)).toBe(true);
    expect(rectsOverlap({ x: 0.75, y: 0, halfW: 0.1, halfH: 0.1 }, hero)).toBe(false);
    expect(rectsOverlap({ x: 0.2, y: 0.5, halfW: 0.1, halfH: 0.1 }, hero)).toBe(false);
  });

  it('treats the margin as extra clearance', () => {
    const near = { x: 0.62, y: 0, halfW: 0.1, halfH: 0.1 };
    expect(rectsOverlap(near, hero)).toBe(false);
    expect(rectsOverlap(near, hero, 0.05)).toBe(true);
  });
});
