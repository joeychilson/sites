import { useLayoutEffect, useRef } from 'react';

/**
 * Eases an element from its height before a change to its height after, on the app's spring, each
 * time `key` changes. Returns the element's ref, and `measure` to call just before making the change.
 */
export function useHeightTransition<T extends HTMLElement>(key: unknown) {
  const ref = useRef<T>(null);
  const before = useRef<number | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    const from = before.current;
    before.current = null;
    if (!element || from === null || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // One still running would make the new height read as the animated one.
    for (const animation of element.getAnimations()) animation.cancel();
    const to = element.offsetHeight;
    if (to === from) return;
    // 400ms is motion.spring, the duration --ease-spring was sampled over.
    element.animate(
      [
        { height: `${from}px`, overflow: 'hidden' },
        { height: `${to}px`, overflow: 'hidden' },
      ],
      { duration: 400, easing: getComputedStyle(element).getPropertyValue('--ease-spring') },
    );
  }, [key]);

  const measure = () => {
    before.current = ref.current?.offsetHeight ?? null;
  };

  return [ref, measure] as const;
}
