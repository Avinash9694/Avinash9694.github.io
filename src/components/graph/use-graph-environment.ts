import { useEffect, useState, type RefObject } from 'react';

export interface GraphColors {
  ink: string;
  tech: string;
  edge: string;
  accent: string;
}

function readColors(): GraphColors {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return {
    ink: read('--ink', '#1c1b19'),
    tech: read('--node-tech', '#b3ac9f'),
    edge: read('--edge', '#1c1b19'),
    accent: read('--accent', '#2f4a8a'),
  };
}

/** The page's colour tokens, re-read when the system theme flips. */
export function useThemeColors(): GraphColors {
  const [colors, setColors] = useState(readColors);
  useEffect(() => {
    const scheme = matchMedia('(prefers-color-scheme: dark)');
    const update = () => setColors(readColors());
    scheme.addEventListener('change', update);
    return () => scheme.removeEventListener('change', update);
  }, []);
  return colors;
}

/** True while the element is on screen and the tab is in the foreground. */
export function useActive(ref: RefObject<HTMLElement | null>): boolean {
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState === 'visible');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry?.isIntersecting ?? true),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    const update = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return onScreen && tabVisible;
}
