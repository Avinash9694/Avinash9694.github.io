export interface DeviceSignals {
  reducedMotion: boolean;
  webgl: boolean;
  saveData: boolean;
  /** navigator.hardwareConcurrency; undefined when the browser does not say. */
  cores: number | undefined;
  coarsePointer: boolean;
}

/** Whether to replace the static drawing with the live 3D scene. */
export function shouldRender3D(s: DeviceSignals): boolean {
  if (s.reducedMotion || !s.webgl || s.saveData) return false;
  const lowEndTouch = s.coarsePointer && s.cores !== undefined && s.cores <= 4;
  return !lowEndTouch;
}
