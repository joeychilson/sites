import { colorVars, typographyVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { media, tokens } from '../styles/tokens.stylex';

/** Claude Code's prompt, with Turnscope's status line under it. */
export default function StatusLine() {
  return (
    <div {...stylex.props(styles.prompt)}>
      <div {...stylex.props(styles.promptLine)}>
        <span {...stylex.props(styles.faint)}>&gt;</span> <span {...stylex.props(styles.cursor)} />
      </div>
      <div {...stylex.props(styles.statusLine)}>
        Claude Max · 5h 28%, out in 1h · weekly 60% · Opus weekly used up, back Sat 09:00
      </div>
    </div>
  );
}

const blink = stylex.keyframes({
  '0%, 50%': { opacity: 1 },
  '50.01%, 100%': { opacity: 0 },
});

const styles = stylex.create({
  prompt: {
    paddingInline: 20,
    paddingBlock: 16,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: tokens.window,
    boxShadow: '0 0 0 0.5px rgb(255 255 255 / 0.14)',
    fontFamily: typographyVars['--font-family-code'],
    fontSize: 13,
    lineHeight: 1.65,
    letterSpacing: 'normal',
  },
  promptLine: {
    paddingBlock: 6,
    borderBlockWidth: 1,
    borderBlockStyle: 'solid',
    borderBlockColor: tokens.textFaint,
  },
  faint: {
    color: colorVars['--color-text-disabled'],
  },
  cursor: {
    display: 'inline-block',
    width: '0.6em',
    height: '1.1em',
    verticalAlign: 'text-bottom',
    backgroundColor: colorVars['--color-text-disabled'],
    animationName: { default: blink, [media.reducedMotion]: 'none' },
    animationDuration: '1.1s',
    animationIterationCount: 'infinite',
  },
  statusLine: {
    marginTop: 6,
    color: colorVars['--color-text-secondary'],
  },
});
