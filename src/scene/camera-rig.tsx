import { useFrame, useThree } from '@react-three/fiber';
import { damp, damp3 } from 'maath/easing';
import { useMemo, useRef } from 'react';
import { CatmullRomCurve3, PerspectiveCamera, Vector3 } from 'three';
import { KEYFRAMES, portraitFov, progressToT } from '../lib/camera-path';
import { framingFor } from '../lib/framing';
import { sectionFromProgress } from '../lib/progress-map';
import { pointer } from '../lib/pointer';
import { useSceneStore } from '../store/scene-store';

const UP = new Vector3(0, 1, 0);

/** Moves the camera along the keyframe curve, damped, with a little pointer parallax. */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const curves = useMemo(
    () => ({
      position: new CatmullRomCurve3(
        KEYFRAMES.map((k) => new Vector3(...k.position)),
        false,
        'centripetal',
      ),
      target: new CatmullRomCurve3(
        KEYFRAMES.map((k) => new Vector3(...k.target)),
        false,
        'centripetal',
      ),
    }),
    [],
  );
  const v = useRef({
    pos: new Vector3(),
    look: new Vector3(),
    currentLook: new Vector3(),
    forward: new Vector3(),
    right: new Vector3(),
    up: new Vector3(),
    parallax: new Vector3(),
    frame: { x: 0, y: 0, zoom: 1 },
    applied: { x: NaN, y: NaN, zoom: NaN, w: 0, h: 0, fov: 0 },
    settled: false,
  }).current;

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const progress = useSceneStore.getState().progress;
    const framing = framingFor(sectionFromProgress(progress), size.width, size.height);
    if (!v.settled) {
      v.frame.x = framing.x;
      v.frame.y = framing.y;
      v.frame.zoom = framing.zoom;
    } else {
      damp(v.frame, 'x', framing.x, 0.45, delta);
      damp(v.frame, 'y', framing.y, 0.45, delta);
      damp(v.frame, 'zoom', framing.zoom, 0.45, delta);
    }
    if (camera instanceof PerspectiveCamera) {
      const fov = portraitFov(state.viewport.aspect);
      const a = v.applied;
      const moved =
        Math.abs(a.x - v.frame.x) > 1e-4 ||
        Math.abs(a.y - v.frame.y) > 1e-4 ||
        Math.abs(a.zoom - v.frame.zoom) > 1e-4 ||
        a.w !== size.width ||
        a.h !== size.height ||
        a.fov !== fov;
      if (moved) {
        camera.fov = fov;
        camera.zoom = v.frame.zoom;
        // Shifting the view window moves the subject into the space the overlay leaves free.
        camera.setViewOffset(
          size.width,
          size.height,
          -v.frame.x * size.width,
          v.frame.y * size.height,
          size.width,
          size.height,
        );
        Object.assign(a, {
          x: v.frame.x,
          y: v.frame.y,
          zoom: v.frame.zoom,
          w: size.width,
          h: size.height,
          fov,
        });
      }
    }
    const t = progressToT(progress);
    curves.position.getPoint(t, v.pos);
    curves.target.getPoint(t, v.look);

    v.forward.subVectors(v.look, v.pos).normalize();
    v.right.crossVectors(v.forward, UP).normalize();
    v.up.crossVectors(v.right, v.forward);
    damp3(
      v.parallax,
      [pointer.active ? pointer.x : 0, pointer.active ? pointer.y : 0, 0],
      0.6,
      delta,
    );
    v.pos.addScaledVector(v.right, v.parallax.x * 0.45).addScaledVector(v.up, v.parallax.y * 0.22);

    if (!v.settled) {
      camera.position.copy(v.pos);
      v.currentLook.copy(v.look);
      v.settled = true;
    } else {
      damp3(camera.position, v.pos, 0.42, delta);
      damp3(v.currentLook, v.look, 0.42, delta);
    }
    camera.lookAt(v.currentLook);
  });

  return null;
}
