import { useRef } from 'react';
import { flushSync } from 'react-dom';

// Make a state change through `animateHeight`, and the element springs from its old height to its
// new one. The update is flushed at once so both heights can be read in the same event.
export function useHeightTransition<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const animateHeight = (update: () => void) => {
    const start = ref.current?.offsetHeight;
    flushSync(update);
    const element = ref.current;
    if (!element || start === undefined || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const end = element.offsetHeight;
    if (end === start) {
      return;
    }
    const style = getComputedStyle(element);
    element.animate(
      { height: [`${start}px`, `${end}px`], overflow: ['hidden', 'hidden'] },
      {
        duration: Number.parseFloat(style.getPropertyValue('--spring')),
        easing: style.getPropertyValue('--ease-spring'),
      },
    );
  };

  return [ref, animateHeight] as const;
}
