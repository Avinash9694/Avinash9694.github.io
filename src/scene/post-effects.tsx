import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';

/** High tier only: bloom on the emissive bits, a soft vignette, film grain. */
export default function PostEffects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        mipmapBlur
        luminanceThreshold={1}
        luminanceSmoothing={0.25}
        intensity={0.6}
        radius={0.7}
      />
      <ChromaticAberration offset={[0.00045, 0.00045]} radialModulation modulationOffset={0.6} />
      <Noise opacity={0.04} premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette eskil={false} offset={0.2} darkness={0.85} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
