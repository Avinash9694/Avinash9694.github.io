import { create } from 'zustand';
import { degradeTier, type Tier } from '../lib/device-tier';

interface SceneState {
  tier: Tier;
  progress: number;
  /** 0..100 from three's loading manager, mirrored here so the loader needs no three.js. */
  loadProgress: number;
  /** True once the hero has its first frame; the loader fades on it. */
  ready: boolean;
  hasScrolled: boolean;
  setTier: (tier: Tier) => void;
  degrade: () => void;
  setProgress: (progress: number) => void;
  setReady: () => void;
  setLoadProgress: (loadProgress: number) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  tier: 'medium',
  progress: 0,
  loadProgress: 0,
  ready: false,
  hasScrolled: false,
  setTier: (tier) => set({ tier }),
  degrade: () => set((s) => ({ tier: degradeTier(s.tier) })),
  setProgress: (progress) =>
    set((s) => ({ progress, hasScrolled: s.hasScrolled || progress > 0.015 })),
  setReady: () => {
    document.documentElement.dataset.ready = 'true';
    set({ ready: true });
  },
  setLoadProgress: (loadProgress) => set({ loadProgress }),
}));
