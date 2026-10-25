import type { DeviceSignals } from '../../lib/render-3d';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return gl !== null;
  } catch {
    return false;
  }
}

interface NetworkInformationLike {
  saveData?: boolean;
}

export function readDeviceSignals(): DeviceSignals {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  return {
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    webgl: hasWebGL(),
    saveData: connection?.saveData === true,
    cores: navigator.hardwareConcurrency || undefined,
    coarsePointer: matchMedia('(pointer: coarse)').matches,
  };
}
