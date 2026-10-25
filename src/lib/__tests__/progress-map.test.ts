import { roles } from '../../data/experience';
import { PROJECT_COUNT } from '../../data/projects';
import { SECTION_COUNT } from '../../data/site';
import {
  PROJECT_STATIONS,
  ROLE_STATIONS,
  activeProject,
  activeRole,
  nearestStation,
  sectionFromProgress,
  sectionStation,
  stationDistance,
  subStations,
} from '../progress-map';

describe('sectionFromProgress', () => {
  it('splits progress into five equal bands and clamps the ends', () => {
    expect(sectionFromProgress(-1)).toBe(0);
    expect(sectionFromProgress(0)).toBe(0);
    expect(sectionFromProgress(0.19)).toBe(0);
    expect(sectionFromProgress(0.2)).toBe(1);
    expect(sectionFromProgress(0.59)).toBe(2);
    expect(sectionFromProgress(0.61)).toBe(3);
    expect(sectionFromProgress(1)).toBe(SECTION_COUNT - 1);
    expect(sectionFromProgress(5)).toBe(SECTION_COUNT - 1);
  });
});

describe('sectionStation', () => {
  it('lands inside the section it names', () => {
    for (let i = 0; i < SECTION_COUNT; i++) {
      expect(sectionFromProgress(sectionStation(i))).toBe(i);
    }
    expect(sectionStation(0)).toBe(0);
  });
});

describe('subStations', () => {
  it('spaces stations evenly inside the section, away from its edges', () => {
    const stations = subStations(3, 4, 0.1);
    expect(stations).toHaveLength(4);
    expect(stations[0]).toBeCloseTo(0.6 + 0.2 * 0.1);
    expect(stations[3]).toBeCloseTo(0.6 + 0.2 * 0.9);
    stations.forEach((s) => expect(sectionFromProgress(s)).toBe(3));
  });

  it('puts a single station in the middle', () => {
    expect(subStations(1, 1)[0]).toBeCloseTo(0.3);
  });
});

describe('role and project stations', () => {
  it('has one station per role and per project, all within their sections', () => {
    expect(ROLE_STATIONS).toHaveLength(roles.length);
    expect(PROJECT_STATIONS).toHaveLength(PROJECT_COUNT);
    ROLE_STATIONS.forEach((s) => expect(sectionFromProgress(s)).toBe(2));
    PROJECT_STATIONS.forEach((s) => expect(sectionFromProgress(s)).toBe(3));
  });

  it('round-trips: the station of item i resolves back to i', () => {
    ROLE_STATIONS.forEach((s, i) => expect(activeRole(s)).toBe(i));
    PROJECT_STATIONS.forEach((s, i) => expect(activeProject(s)).toBe(i));
  });

  it('snaps to the nearest station and clamps outside the section', () => {
    expect(nearestStation([0.1, 0.5, 0.9], 0.4)).toBe(1);
    expect(nearestStation([0.1, 0.5, 0.9], 0.75)).toBe(2);
    expect(activeProject(0)).toBe(0);
    expect(activeProject(1)).toBe(PROJECT_COUNT - 1);
  });

  it('measures distance in station steps', () => {
    expect(stationDistance(PROJECT_STATIONS, 0, PROJECT_STATIONS[0] ?? 0)).toBeCloseTo(0);
    expect(stationDistance(PROJECT_STATIONS, 0, PROJECT_STATIONS[1] ?? 0)).toBeCloseTo(1);
  });
});
