import * as stylex from '@stylexjs/stylex';

import { media } from './tokens.stylex';

const rise = stylex.keyframes({
  from: { opacity: 0, translate: '0 32px' },
  to: { opacity: 1, translate: 'none' },
});

export const layout = stylex.create({
  /** The page's width, with room at the sides. */
  column: {
    width: '100%',
    maxWidth: 1180,
    marginInline: 'auto',
    paddingInline: { default: 20, [media.wide]: 32 },
  },
  /** Rises into place as it scrolls into view, where the browser can tie motion to scrolling. */
  rise: {
    animationName: {
      default: null,
      [media.scrollLinked]: { default: rise, [media.reducedMotion]: 'none' },
    },
    animationTimingFunction: 'linear',
    animationFillMode: 'both',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 35%',
  },
});
