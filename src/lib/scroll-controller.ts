import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useSceneStore } from '../store/scene-store';
import { sectionStation, PROJECT_STATIONS, ROLE_STATIONS } from './progress-map';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Lenis owns the wheel; ScrollTrigger turns the spacer's scroll into store progress. */
export function installScroll(spacer: HTMLElement): () => void {
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const setProgress = useSceneStore.getState().setProgress;
  const trigger = ScrollTrigger.create({
    trigger: spacer,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => setProgress(self.progress),
  });
  setProgress(trigger.progress);

  return () => {
    trigger.kill();
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function maxScroll(): number {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

export function scrollToProgress(progress: number, duration = 1.4): void {
  const y = Math.min(1, Math.max(0, progress)) * maxScroll();
  if (lenis) lenis.scrollTo(y, { duration, easing: easeOut });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

export const goToSection = (index: number): void => scrollToProgress(sectionStation(index));
export const goToRole = (index: number): void => scrollToProgress(ROLE_STATIONS[index] ?? 0, 1);
export const goToProject = (index: number): void =>
  scrollToProgress(PROJECT_STATIONS[index] ?? 0, 1);
