import { useProgress } from '@react-three/drei';
import { useEffect } from 'react';
import { useSceneStore } from '../store/scene-store';

/** Mounts once the hero's assets have resolved, which is when the loader may go. */
export function SceneReady() {
  const setReady = useSceneStore((s) => s.setReady);
  useEffect(() => {
    setReady();
  }, [setReady]);
  return null;
}

/** Mirrors drei's loading progress into the store, where the (three-free) loader reads it. */
export function LoadProgressBridge() {
  const { progress } = useProgress();
  const setLoadProgress = useSceneStore((s) => s.setLoadProgress);
  useEffect(() => {
    setLoadProgress(progress);
  }, [progress, setLoadProgress]);
  return null;
}
