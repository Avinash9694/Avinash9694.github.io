import { PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, lazy } from 'react';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { useSceneStore } from '../store/scene-store';
import { CameraRig } from './camera-rig';
import { LoadProgressBridge, SceneReady } from './scene-ready';
import { WorldScene } from './world-scene';
import styles from './scene-canvas.module.css';

const PostEffects = lazy(() => import('./post-effects'));

export default function SceneCanvas() {
  const tier = useSceneStore((s) => s.tier);
  const degrade = useSceneStore((s) => s.degrade);
  const high = tier === 'high';

  return (
    <div className={styles.canvas} aria-hidden="true">
      <LoadProgressBridge />
      <Canvas
        dpr={[1, high ? 1.75 : 1.25]}
        camera={{ fov: 38, near: 0.1, far: 90, position: [0, 2.7, 9.2] }}
        shadows={{ type: PCFSoftShadowMap }}
        gl={{
          antialias: !high,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping,
        }}
      >
        <color attach="background" args={['#06080f']} />
        <fog attach="fog" args={['#06080f', 16, 48]} />
        <PerformanceMonitor onDecline={degrade} flipflops={2} />
        <Suspense fallback={null}>
          <WorldScene tier={tier} />
          <SceneReady />
        </Suspense>
        {high && (
          <Suspense fallback={null}>
            <PostEffects />
          </Suspense>
        )}
        <CameraRig />
      </Canvas>
    </div>
  );
}
