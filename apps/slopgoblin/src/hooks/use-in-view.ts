import { type RefObject, useEffect } from 'react';

/**
 * Calls `onEnter` once, the first time `element` comes into view: once its top is a tenth of the
 * screen above the bottom. `onEnter` should keep its identity from render to render.
 */
export function useInView(element: RefObject<Element | null>, onEnter: () => void) {
  useEffect(() => {
    const target = element.current;
    if (!target) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          onEnter();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [element, onEnter]);
}
