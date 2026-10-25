/**
 * Where on screen each station's subject should sit, given where its overlay card is.
 * The camera rig applies this as a view offset and zoom, so the keyframes stay centred
 * on the subject and the layout logic lives here, mirroring the overlay CSS.
 */

export const LAYOUT = {
  /** Matches the 860px breakpoint in overlay.module.css. */
  mobileMax: 860,
  /** Below this the rail shows ticks only (progress-rail.module.css). */
  railLabelsMin: 1200,
  railWithLabels: 150,
  railTicksOnly: 60,
  gap: 28,
  bar: 64,
  experienceRightInset: 64,
  heroLiftDesktop: 0.13,
  heroLiftMobile: 0.14,
  mobileLift: 0.24,
} as const;

/** Card widths as in overlay.module.css: `min(max, vw * fraction)`. */
const PANELS = {
  about: { max: 540, vw: 0.46 },
  projects: { max: 460, vw: 0.42 },
  contact: { max: 460, vw: 0.42 },
  experience: { max: 600, vw: 0.56 },
} as const;

/** Free width per viewport height at which a station's subject is shown at full size. */
const FULL_SIZE_RATIO: Record<string, number> = { about: 0.72, contact: 1 };
const MOBILE_ZOOM: Record<string, number> = { about: 0.58, contact: 0.8 };
const MIN_ZOOM = 0.55;

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'contact'] as const;
type StationId = (typeof SECTION_IDS)[number];

export interface Framing {
  /** Fraction of the viewport width to move the subject right (negative: left). */
  x: number;
  /** Fraction of the viewport height to move the subject up. */
  y: number;
  /** Camera zoom; below 1 the subject shrinks to fit the free space. */
  zoom: number;
  /** Pixels of free space the subject may fill. */
  freeWidth: number;
  freeHeight: number;
}

export function gutter(width: number): number {
  return Math.min(72, Math.max(20, width * 0.05));
}

export function isMobileLayout(width: number): boolean {
  return width <= LAYOUT.mobileMax;
}

export function railReserve(width: number): number {
  return width >= LAYOUT.railLabelsMin ? LAYOUT.railWithLabels : LAYOUT.railTicksOnly;
}

export function panelWidth(id: keyof typeof PANELS, width: number): number {
  const panel = PANELS[id];
  return Math.min(panel.max, width * panel.vw, width - 2 * gutter(width));
}

function centredIn(left: number, right: number, width: number): number {
  return ((left + right) / 2 - width / 2) / width;
}

function fitZoom(id: StationId, freeWidth: number, height: number): number {
  const ratio = FULL_SIZE_RATIO[id];
  if (!ratio) return 1;
  return Math.min(1, Math.max(MIN_ZOOM, freeWidth / height / ratio));
}

export function framingFor(section: number, width: number, height: number): Framing {
  const id: StationId =
    SECTION_IDS[Math.min(SECTION_IDS.length - 1, Math.max(0, section))] ?? 'hero';
  const g = gutter(width);

  if (isMobileLayout(width)) {
    const lift = id === 'hero' ? LAYOUT.heroLiftMobile : LAYOUT.mobileLift;
    return {
      x: 0,
      y: lift,
      zoom: MOBILE_ZOOM[id] ?? 1,
      freeWidth: width - 2 * g,
      freeHeight: height * 0.4,
    };
  }

  const freeHeight = height - 2 * LAYOUT.bar;
  if (id === 'hero') {
    return { x: 0, y: LAYOUT.heroLiftDesktop, zoom: 1, freeWidth: width - 2 * g, freeHeight };
  }
  if (id === 'experience') {
    const right = width - (g + LAYOUT.experienceRightInset) - panelWidth(id, width) - LAYOUT.gap;
    const freeWidth = right - g;
    return {
      x: centredIn(g, right, width),
      y: 0,
      zoom: fitZoom(id, freeWidth, height),
      freeWidth,
      freeHeight,
    };
  }
  const left = g + panelWidth(id, width) + LAYOUT.gap;
  const right = width - railReserve(width);
  const freeWidth = right - left;
  return {
    x: centredIn(left, right, width),
    y: 0,
    zoom: fitZoom(id, freeWidth, height),
    freeWidth,
    freeHeight,
  };
}

export interface ScreenRect {
  x: number;
  y: number;
  halfW: number;
  halfH: number;
}

/** Axis-aligned overlap in normalised device coordinates, with a margin around `b`. */
export function rectsOverlap(a: ScreenRect, b: ScreenRect, margin = 0): boolean {
  return (
    Math.abs(a.x - b.x) < a.halfW + b.halfW + margin &&
    Math.abs(a.y - b.y) < a.halfH + b.halfH + margin
  );
}

/**
 * World scale for the active project frame so it fills most of the free space
 * without spilling into the card or the rail.
 */
export function heroFrameScale(
  free: Pick<Framing, 'freeWidth' | 'freeHeight'>,
  viewHeight: number,
  fovDeg: number,
  distance: number,
  frame: { width: number; height: number },
  max = 1.15,
): number {
  const pxPerUnit = viewHeight / (2 * distance * Math.tan((fovDeg * Math.PI) / 360));
  const byWidth = (free.freeWidth * 0.86) / (frame.width * pxPerUnit);
  const byHeight = (free.freeHeight * 0.8) / (frame.height * pxPerUnit);
  return Math.max(0.2, Math.min(max, byWidth, byHeight));
}
