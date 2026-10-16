import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { type Ref, startTransition, useOptimistic } from 'react';

import { a11y } from '../styles/a11y';
import { tokens } from '../styles/tokens.stylex';

type CommandProps = {
  command: string;
  /** Keeps lines as written and scrolls sideways, as for JSON; otherwise long lines break after a slash. */
  isPre?: boolean;
  ref?: Ref<HTMLDivElement>;
};

const COPIED_FOR = 1800;

/** A command with a Copy button. */
export default function Command({ command, isPre = false, ref }: CommandProps) {
  // "Copied" lasts as long as the copy action, which holds on for a moment after copying. If the
  // clipboard refuses, the action ends at once and the label goes back.
  const [isCopied, setIsCopied] = useOptimistic(false);

  const copy = () =>
    startTransition(async () => {
      setIsCopied(true);
      try {
        await navigator.clipboard.writeText(command);
      } catch {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, COPIED_FOR));
    });

  return (
    <div ref={ref} {...stylex.props(styles.box)}>
      <code {...stylex.props(styles.code, isPre ? styles.pre : styles.wrap)}>
        {isPre
          ? command
          : command.split(/(?<=\/)/).map((part, index) => (
              <span key={index}>
                {index > 0 && <wbr />}
                {part}
              </span>
            ))}
      </code>
      <button type="button" onClick={copy} {...stylex.props(styles.button)}>
        {isCopied ? 'Copied' : 'Copy'}
      </button>
      <span aria-live="polite" {...stylex.props(a11y.visuallyHidden)}>
        {isCopied ? 'Copied to the clipboard' : ''}
      </span>
    </div>
  );
}

const styles = stylex.create({
  box: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
    paddingBlock: 6,
    paddingInlineStart: 16,
    paddingInlineEnd: 6,
    borderRadius: 12,
    backgroundColor: colorVars['--color-background-muted'],
    textAlign: 'start',
  },
  code: {
    flexGrow: 1,
    minWidth: 0,
    paddingBlock: 5,
    fontSize: 13,
    lineHeight: '22px',
    letterSpacing: 'normal',
    color: colorVars['--color-text-primary'],
  },
  wrap: {
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  },
  pre: {
    overflowX: 'auto',
    whiteSpace: 'pre',
  },
  button: {
    flexShrink: 0,
    width: 74,
    height: 32,
    borderRadius: 999,
    backgroundColor: {
      default: tokens.thumb,
      ':hover': tokens.thumbRaised,
    },
    boxShadow: tokens.shadowThumb,
    color: colorVars['--color-text-primary'],
    fontSize: 13,
    fontWeight: 500,
    cursor: 'default',
    transitionProperty: 'background-color',
    transitionDuration: '150ms',
  },
});
