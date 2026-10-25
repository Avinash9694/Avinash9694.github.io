const FLASH_CLASS = 'is-flashed';
const timers = new WeakMap<Element, number>();

/** Scroll to a Work entry and tint it briefly so the eye lands on the right one. */
export function focusWorkEntry(anchor: string): void {
  const el = document.getElementById(anchor);
  if (!el) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  window.clearTimeout(timers.get(el));
  el.classList.add(FLASH_CLASS);
  timers.set(
    el,
    window.setTimeout(() => el.classList.remove(FLASH_CLASS), 1200),
  );
}
