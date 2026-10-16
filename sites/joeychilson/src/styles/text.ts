import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { city } from './tokens.stylex';

export const text = stylex.create({
  /** A link in running text, faintly underlined until it's hovered. */
  link: {
    textDecorationLine: 'underline',
    textDecorationThickness: 1,
    textUnderlineOffset: 3,
    textDecorationColor: { default: colorVars['--color-border'], ':hover': 'currentColor' },
    transitionProperty: 'text-decoration-color',
    transitionDuration: '200ms',
  },
  /** A small label in the name's pixel face: a code block's language, its copy button, an alert's kind. */
  pixel: {
    color: colorVars['--color-text-disabled'],
    fontFamily: city.pixelFont,
    fontSize: 11,
    fontWeight: 400,
    lineHeight: '11px',
    letterSpacing: 0,
  },
});
