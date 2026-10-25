import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, Color, Vector3, type ShaderMaterial } from 'three';

const AMBER = new Color('#ffb45c');
const CYAN = new Color('#5fd6ff');

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aScale;
  attribute vec3 aColor;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.22 + aSeed * 6.2831) * 0.45;
    p.y += sin(uTime * 0.17 + aSeed * 12.566) * 0.3;
    p.z += cos(uTime * 0.19 + aSeed * 3.1415) * 0.45;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio / max(0.5, -mv.z);
    float twinkle = 0.55 + 0.45 * sin(uTime * 0.9 + aSeed * 40.0);
    vAlpha = smoothstep(34.0, 3.0, -mv.z) * twinkle;
    vColor = aColor;
  }
`;

const fragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * 1.6, a);
  }
`;

const BOUNDS = { min: new Vector3(-12, -1.5, -14), max: new Vector3(13, 7, 18) };

/** Drifting motes, moved entirely on the GPU; the CPU only bumps a time uniform. */
export function Dust({ count }: { count: number }) {
  const material = useRef<ShaderMaterial>(null);
  const { positions, seeds, scales, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const c = new Color();
    for (let i = 0; i < count; i++) {
      positions[i * 3] = BOUNDS.min.x + Math.random() * (BOUNDS.max.x - BOUNDS.min.x);
      positions[i * 3 + 1] = BOUNDS.min.y + Math.random() * (BOUNDS.max.y - BOUNDS.min.y);
      positions[i * 3 + 2] = BOUNDS.min.z + Math.random() * (BOUNDS.max.z - BOUNDS.min.z);
      seeds[i] = Math.random();
      scales[i] = 0.5 + Math.random() * 1.6;
      c.copy(Math.random() < 0.55 ? AMBER : CYAN);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, seeds, scales, colors };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 9 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime!.value = state.clock.elapsedTime;
    material.current.uniforms.uPixelRatio!.value = state.gl.getPixelRatio();
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
