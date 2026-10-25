import { SECTION_COUNT } from '../data/site';
import { roles } from '../data/experience';
import { PROJECT_COUNT } from '../data/projects';

export const SECTION_SPAN = 1 / SECTION_COUNT;
export const PROJECTS_SECTION = 3;
export const EXPERIENCE_SECTION = 2;

export const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/** Which section's overlay is on screen for a scroll progress in [0, 1]. */
export function sectionFromProgress(progress: number): number {
  return Math.min(SECTION_COUNT - 1, Math.max(0, Math.floor(clamp01(progress) * SECTION_COUNT)));
}

/** A settled progress inside a section: a little past the camera's arrival point. */
export function sectionStation(index: number): number {
  if (index <= 0) return 0;
  return clamp01(index * SECTION_SPAN + 0.035);
}

/** `count` evenly spaced stations inside a section, padded away from its edges. */
export function subStations(section: number, count: number, padding = 0.06): number[] {
  const start = section * SECTION_SPAN;
  if (count === 1) return [start + SECTION_SPAN / 2];
  return Array.from({ length: count }, (_, i) => {
    const frac = padding + (1 - 2 * padding) * (i / (count - 1));
    return start + SECTION_SPAN * frac;
  });
}

export function nearestStation(stations: number[], progress: number): number {
  let best = 0;
  let bestDistance = Infinity;
  stations.forEach((station, i) => {
    const distance = Math.abs(station - progress);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  });
  return best;
}

export const ROLE_STATIONS = subStations(EXPERIENCE_SECTION, roles.length, 0.12);
export const PROJECT_STATIONS = subStations(PROJECTS_SECTION, PROJECT_COUNT, 0.06);

export const activeRole = (progress: number): number => nearestStation(ROLE_STATIONS, progress);
export const activeProject = (progress: number): number =>
  nearestStation(PROJECT_STATIONS, progress);

/** 0 at the station itself, 1 one station away; drives per-item emphasis in the scene. */
export function stationDistance(stations: number[], index: number, progress: number): number {
  const step = stations.length > 1 ? (stations[1] ?? 0) - (stations[0] ?? 0) : SECTION_SPAN;
  return Math.abs(progress - (stations[index] ?? 0)) / step;
}
