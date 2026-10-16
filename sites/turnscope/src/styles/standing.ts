import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

/** How a limit stands: it lasts until it resets, it runs out first, or it's used up. */
export type Standing = 'lasts' | 'short' | 'out';

/** The app's text color for each standing: amber for one that won't last, red for one used up. */
export const standingInk = stylex.create({
  lasts: {},
  short: { color: colorVars['--color-warning'] },
  out: { color: colorVars['--color-error'] },
});
