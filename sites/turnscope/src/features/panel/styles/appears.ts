import * as stylex from '@stylexjs/stylex';

import { media, motion } from '../../../styles/tokens.stylex';

/**
 * The app's `appears` transition: content fades in once its space has opened, and fades out at
 * once, so nothing moving passes over text. Hidden content leaves the accessibility tree and the
 * tab order once it has faded.
 */
export const appears = stylex.create({
  hidden: {
    opacity: 0,
    visibility: 'hidden',
    transitionProperty: 'opacity, visibility',
    transitionDuration: `${motion.vanish}, 0s`,
    transitionDelay: `0s, ${motion.vanish}`,
    transitionTimingFunction: 'ease-out',
  },
  // Inherited, so content inside a folded section stays hidden with it.
  shown: {
    opacity: 1,
    visibility: 'inherit',
    transitionProperty: 'opacity, visibility',
    transitionDuration: `${motion.appear}, 0s`,
    // It waits for the space to open, which it does at once when motion is reduced.
    transitionDelay: { default: `${motion.appear}, 0s`, [media.reducedMotion]: '0s' },
    transitionTimingFunction: 'ease-out',
  },
});
