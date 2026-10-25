import { useFrame, useThree } from '@react-three/fiber';
import { damp3 } from 'maath/easing';
import { useMemo, useRef } from 'react';
import { CatmullRomCurve3, PerspectiveCamera, Vector3 } from 'three';
import { KEYFRAMES, portraitFov, progressToT } from '../lib/camera-path';
import { pointer } from '../lib/pointer';
import { useSceneStore } from '../store/scene-store';

const UP = new Vector3(0, 1, 0);

/** Moves the camera along the keyframe curve, damped, with a little pointer parallax. */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
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
    settled: false,
  }).current;

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    if (camera instanceof PerspectiveCamera) {
      const fov = portraitFov(state.viewport.aspect);
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }
    const t = progressToT(useSceneStore.getState().progress);
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
