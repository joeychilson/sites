import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { media, tokens } from './tokens.stylex';

export const text = stylex.create({
  headline: {
    fontSize: { default: 42, [media.wide]: 64 },
    lineHeight: 1.02,
    fontWeight: 600,
    letterSpacing: '-0.045em',
    textWrap: 'balance',
  },
  body: {
    fontSize: 15,
    lineHeight: 1.6,
    color: colorVars['--color-text-secondary'],
    textWrap: 'pretty',
  },
  /** A command or name in running text. */
  code: {
    fontSize: '0.9em',
    lineHeight: 'inherit',
    color: colorVars['--color-text-primary'],
  },
  /** A link out to the docs, under a section's description. */
  link: {
    fontSize: 15,
    color: {
      default: colorVars['--color-text-secondary'],
      ':hover': colorVars['--color-text-primary'],
    },
    textDecorationLine: 'underline',
    textDecorationColor: tokens.textFaint,
    textUnderlineOffset: 4,
    transitionProperty: 'color',
    transitionDuration: '150ms',
  },
});
