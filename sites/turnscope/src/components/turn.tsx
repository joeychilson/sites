import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

type TurnProps = {
  /** The line's mark: the prompt, a tool call or reply, or a result. */
  mark: string;
  /** A result, indented under the call that made it. */
  isOutput?: boolean;
  isMuted?: boolean;
  children: ReactNode;
};

/** One line of an agent's turn in a Terminal: its mark, then the text indented after it. */
export default function Turn({ mark, isOutput = false, isMuted = false, children }: TurnProps) {
  return (
    <p {...stylex.props(styles.turn, isOutput && styles.output, isMuted && styles.muted)}>
      <span {...stylex.props((isOutput || isMuted) && styles.quietMark)}>{mark}</span>
      <span>{children}</span>
    </p>
  );
}

const styles = stylex.create({
  // The theme gives every <p> the body type; a terminal line keeps the window's.
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
