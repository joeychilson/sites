import { colorVars, typographyVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import { tokens } from '../styles/tokens.stylex';

type TerminalProps = {
  title: string;
  /** Its transcript, as `Turn`s. */
  children: ReactNode;
};

type TurnProps = {
  /** The glyph in the margin: a prompt, a call or its output. */
  mark: string;
  /** Indents it under the call it answers. */
  isOutput?: boolean;
  /** Quiets it, for what the person typed. */
  isMuted?: boolean;
  children: ReactNode;
};

/** A Mac terminal window with an agent's transcript in it. */
export default function Terminal({ title, children }: TerminalProps) {
  return (
    <div {...stylex.props(styles.window)}>
      <div {...stylex.props(styles.titleBar)}>
        <span aria-hidden="true" {...stylex.props(styles.lights)}>
          <span {...stylex.props(styles.light, styles.close)} />
          <span {...stylex.props(styles.light, styles.minimize)} />
          <span {...stylex.props(styles.light, styles.zoom)} />
        </span>
        <span {...stylex.props(styles.title)}>{title}</span>
      </div>
      <div {...stylex.props(styles.body)}>{children}</div>
    </div>
  );
}

export function Turn({ mark, isOutput = false, isMuted = false, children }: TurnProps) {
  return (
    <p {...stylex.props(styles.turn, isOutput && styles.output, isMuted && styles.muted)}>
      <span {...stylex.props((isOutput || isMuted) && styles.quietMark)}>{mark}</span>
      <span>{children}</span>
    </p>
  );
}

const styles = stylex.create({
  window: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: tokens.window,
    boxShadow: tokens.shadowWindow,
    textAlign: 'start',
  },
  titleBar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: 36,
    paddingInline: 14,
  },
  lights: {
    display: 'flex',
    gap: 8,
  },
  light: {
    width: 12,
    height: 12,
    borderRadius: '50%',
  },
  close: { backgroundColor: '#ff5f57' },
  minimize: { backgroundColor: '#febc2e' },
  zoom: { backgroundColor: '#28c840' },
  title: {
    position: 'absolute',
    insetInline: 0,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 600,
    color: colorVars['--color-text-disabled'],
  },
  body: {
    paddingInline: 20,
    paddingBlock: '8px 24px',
    fontFamily: typographyVars['--font-family-code'],
    fontSize: 13,
    lineHeight: 1.65,
    letterSpacing: 'normal',
    color: colorVars['--color-text-primary'],
  },
  // The reset gives every <p> the body's type; a terminal line keeps the window's.
  turn: {
    display: 'grid',
    gridTemplateColumns: '2ch minmax(0, 1fr)',
    marginTop: { default: 16, ':first-child': 0 },
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit',
  },
  output: {
    gridTemplateColumns: '3ch minmax(0, 1fr)',
    paddingInlineStart: '2ch',
    marginTop: 0,
    color: colorVars['--color-text-secondary'],
  },
  muted: {
    color: colorVars['--color-text-secondary'],
  },
  quietMark: {
    color: colorVars['--color-text-disabled'],
  },
});
