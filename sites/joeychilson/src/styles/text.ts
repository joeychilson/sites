import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

/** Text styles the pages share. */
export const text = stylex.create({
  /** The title of a post, or of an error. */
  title: {
    fontSize: 22,
    lineHeight: '30px',
    fontWeight: 560,
    letterSpacing: '-0.014em',
    textWrap: 'balance',
  },
  quiet: {
    color: colorVars['--color-text-disabled'],
  },
  /** The quiet line under a title: a post's dates, or what an error means. */
  subtitle: {
    marginTop: 4,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: colorVars['--color-text-disabled'],
  },
});
