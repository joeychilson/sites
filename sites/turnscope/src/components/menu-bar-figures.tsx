import * as stylex from '@stylexjs/stylex';

import type { Standing } from '../demo';
import { text } from '../styles/text';
import { media, tokens } from '../styles/tokens.stylex';
import Glyph from './glyph';
import type { LogoName } from './logo';
import MenuBarItem from './panel/menu-bar-item';
import { standingInk } from './panel/styles';

type Figure = {
  logo: LogoName;
  figure: string;
  standing: Standing;
  text: string;
};

// Most urgent first, as the menu bar orders them.
const figures: Array<Figure> = [
  { logo: 'xai', figure: 'Back 5:40 AM', standing: 'out', text: 'Used up. Shows when it’s back.' },
  {
    logo: 'openai',
    figure: '1h 40m',
    standing: 'short',
    text: 'Runs out before it resets. Counts down the last 3 hours.',
  },
  {
    logo: 'anthropic',
    figure: '68%',
    standing: 'lasts',
    text: 'Lasts until it resets. Shows what’s left.',
  },
];

/** The menu bar's right end with three accounts in it, and what each kind of figure means. */
export default function MenuBarFigures() {
  return (
    <>
      <div aria-hidden="true" {...stylex.props(styles.desktop)}>
        <div {...stylex.props(styles.menuBar)}>
          {figures.map((each) => (
            <span key={each.figure} {...stylex.props(styles.menu)}>
              <MenuBarItem logo={each.logo} figure={each.figure} standing={each.standing} />
            </span>
          ))}
          <span {...stylex.props(styles.menu, styles.wideOnly)}>
            <Glyph name="wifi" />
          </span>
          <span {...stylex.props(styles.menu, styles.wideOnly)}>
            <Glyph name="controls" />
          </span>
          <span {...stylex.props(styles.menu, styles.wideOnly, styles.clock)}>Thu 7:00 AM</span>
        </div>
      </div>
      <ul {...stylex.props(styles.legend)}>
        {figures.map((each) => (
          <li key={each.figure}>
            <p {...stylex.props(styles.figure, standingInk[each.standing])}>{each.figure}</p>
            <p {...stylex.props(text.body, styles.text)}>{each.text}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

const styles = stylex.create({
  // A strip of desktop that fades in from the left, as if cut from the top of a screen.
  desktop: {
    containerType: 'inline-size',
    overflow: 'hidden',
    height: 88,
    borderRadius: 16,
    backgroundImage: [
      'radial-gradient(80% 140% at 85% 0%, rgb(237 148 25 / 0.12), transparent 70%)',
      'linear-gradient(170deg, #2a2a30, #121215)',
    ].join(', '),
    boxShadow: '0 0 0 0.5px rgb(255 255 255 / 0.12)',
    maskImage: 'linear-gradient(to right, transparent, #000 18%)',
  },
  menuBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    height: 36,
    paddingInline: 12,
    backgroundColor: 'rgb(0 0 0 / 0.2)',
    color: tokens.label,
    fontSize: 13,
    letterSpacing: 'normal',
    whiteSpace: 'nowrap',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    paddingInline: 6,
  },
  wideOnly: {
    display: { default: null, [media.narrow]: 'none' },
  },
  clock: {
    fontVariantNumeric: 'tabular-nums',
  },
  legend: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr', [media.wide]: 'repeat(3, 1fr)' },
    columnGap: 32,
    rowGap: 24,
    marginTop: 32,
  },
  figure: {
    fontSize: 20,
    lineHeight: 1.4,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    fontVariantNumeric: 'tabular-nums',
  },
  text: {
    marginTop: 4,
  },
});
