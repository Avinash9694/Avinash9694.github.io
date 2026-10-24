import { useEffect, useRef } from 'react';

/**
 * Adds `is-visible` to the referenced element once it scrolls into view.
 * Without IntersectionObserver (old browsers, test runners) the element is shown immediately.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            observer.disconnect();
          }
        }
      },
      // A fixed margin, not a percentage: a percentage of a very tall viewport can exceed the
      // footer's own height and leave the last elements hidden.
      { rootMargin: '0px 0px -40px 0px', threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
