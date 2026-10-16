import { colorVars, typographyVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { media } from '../styles/tokens.stylex';

type CommandListProps = {
  commands: Array<{ command: string; does: string }>;
};

/** Commands, each with a comment saying what it prints. */
export default function CommandList({ commands }: CommandListProps) {
  return (
    <ul {...stylex.props(styles.list)}>
      {commands.map((line) => (
        <li key={line.command} {...stylex.props(styles.line)}>
          <span {...stylex.props(styles.command)}>{line.command}</span>
          <span {...stylex.props(styles.comment)}># {line.does}</span>
        </li>
      ))}
    </ul>
  );
}

const styles = stylex.create({
  list: {
    paddingInline: 20,
    paddingBlock: 16,
    borderRadius: 12,
    backgroundColor: colorVars['--color-background-muted'],
    fontFamily: typographyVars['--font-family-code'],
    fontSize: 13,
    lineHeight: '22px',
    letterSpacing: 'normal',
  },
  line: {
    display: 'flex',
    flexDirection: 'column',
    paddingBlock: { default: 5, [media.wide]: 3 },
  },
  command: {
    color: colorVars['--color-text-primary'],
  },
  comment: {
    color: colorVars['--color-text-disabled'],
  },
});
