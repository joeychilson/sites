import { useLayoutEffect, useRef } from 'react';

import { motion } from './styles/tokens.stylex';

/**
 * Animates an element's height on the app's spring whenever `key` changes. Call `measure` just
 * before the change, so there's a height to start from.
 */
export function useHeightTransition<T extends HTMLElement>(key: unknown) {
  const ref = useRef<T>(null);
  const start = useRef<number | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    const from = start.current;
    start.current = null;
    if (!element || from === null || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // A height still animating would read as the new one.
    for (const animation of element.getAnimations()) animation.cancel();
    const to = element.offsetHeight;
    if (to === from) return;
    element.animate(
      { height: [`${from}px`, `${to}px`], overflow: ['hidden', 'hidden'] },
      {
        duration: Number.parseFloat(motion.spring),
        // Web Animations can't read var(), so the curve comes from the theme by computed style.
        easing: getComputedStyle(element).getPropertyValue('--ease-spring'),
      },
    );
  }, [key]);

  const measure = () => {
    start.current = ref.current?.offsetHeight ?? null;
  };

  return [ref, measure] as const;
}
