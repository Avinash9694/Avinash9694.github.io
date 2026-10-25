export type Tier = 'high' | 'medium' | 'low';

export interface DeviceSignals {
  webgl: boolean;
  webgl2: boolean;
  finePointer: boolean;
  cores: number;
  saveData: boolean;
  reducedMotion: boolean;
}

const TIERS: readonly Tier[] = ['high', 'medium', 'low'];

export function isTier(value: unknown): value is Tier {
  return typeof value === 'string' && (TIERS as readonly string[]).includes(value);
}

/**
 * `low` never gets a canvas: no WebGL, a data-saver or reduced-motion preference,
 * or a touch device with few cores all land there. `high` needs WebGL2, a mouse
 * and a reasonably wide CPU; everything else is `medium`.
 */
export function pickTier(s: DeviceSignals): Tier {
  if (!s.webgl || s.saveData || s.reducedMotion) return 'low';
  if (!s.finePointer && s.cores <= 4) return 'low';
  if (s.webgl2 && s.finePointer && s.cores >= 6) return 'high';
  return 'medium';
}

/** `?tier=high|medium|low` forces a tier, for testing and screenshots. */
export function readTierOverride(search: string): Tier | null {
  const value = new URLSearchParams(search).get('tier');
  return isTier(value) ? value : null;
}

export function degradeTier(tier: Tier): Tier {
  return tier === 'high' ? 'medium' : tier;
}

function probeWebGL(): { webgl: boolean; webgl2: boolean } {
  if (typeof document === 'undefined') return { webgl: false, webgl2: false };
  try {
    const canvas = document.createElement('canvas');
    const webgl2 = canvas.getContext('webgl2') !== null;
    const webgl = webgl2 || canvas.getContext('webgl') !== null;
    return { webgl, webgl2 };
  } catch {
    return { webgl: false, webgl2: false };
  }
}

export function readDeviceSignals(): DeviceSignals {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  const media = (query: string) =>
    typeof window.matchMedia === 'function' && window.matchMedia(query).matches;
  return {
    ...probeWebGL(),
    finePointer: media('(pointer: fine)'),
    cores: nav.hardwareConcurrency || 4,
    saveData: nav.connection?.saveData === true,
    reducedMotion: media('(prefers-reduced-motion: reduce)'),
  };
}

export function detectTier(search = typeof location === 'undefined' ? '' : location.search): Tier {
  return readTierOverride(search) ?? pickTier(readDeviceSignals());
}
