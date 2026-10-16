import * as stylex from '@stylexjs/stylex';

import { media } from './tokens.stylex';

const rise = stylex.keyframes({
  from: { opacity: 0, translate: '0 32px' },
  to: { opacity: 1, translate: 'none' },
});

/** Content that rises into place as it scrolls into view, where the browser can tie motion to scrolling. */
export const reveal = stylex.create({
  rise: {
    animationName: {
      default: null,
      [media.scrollLinked]: {
        default: null,
        [media.motionOk]: rise,
      },
    },
    animationTimingFunction: 'linear',
    animationFillMode: 'both',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 35%',
  },
});
