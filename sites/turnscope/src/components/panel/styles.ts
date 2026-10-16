import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { media, motion, tokens } from '../../styles/tokens.stylex';

/**
 * The app's `appears` transition: content fades in once its space has opened, and out at once, so
 * nothing moving passes over text. Hidden content leaves the accessibility tree and the tab order
 * once it has faded.
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
    // It waits for the space to open, which happens at once when motion is reduced.
    transitionDelay: { default: `${motion.appear}, 0s`, [media.reducedMotion]: '0s' },
    transitionTimingFunction: 'ease-out',
  },
});

/** The app's row (macos/Turnscope/Style.swift). */
export const row = stylex.create({
  padding: {
    paddingBlock: 7,
    paddingInline: 12,
  },
  hover: {
    borderRadius: 10,
    backgroundColor: { default: 'transparent', ':hover': tokens.rowHover },
    transitionProperty: 'background-color',
    transitionDuration: motion.hover,
    transitionTimingFunction: 'ease-out',
  },
});

/** A figure in its standing's color: the label's own when it lasts, amber when short, red when out. */
export const standingInk = stylex.create({
  lasts: {},
  short: { color: colorVars['--color-warning'] },
  out: { color: colorVars['--color-error'] },
});
