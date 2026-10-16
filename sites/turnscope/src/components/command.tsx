import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { type Ref, useEffect, useRef, useState } from 'react';

import { a11y } from '../styles/a11y';
import { tokens } from '../styles/tokens.stylex';

type CommandProps = {
  command: string;
  /** Keeps its lines as written and scrolls, for a file's contents rather than a command to run. */
  isPreformatted?: boolean;
  ref?: Ref<HTMLDivElement>;
};

export default function Command({ command, isPreformatted = false, ref }: CommandProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setIsCopied(true);
    // Copying again starts the wait over.
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsCopied(false), 1800);
  };

  return (
    <div ref={ref} {...stylex.props(styles.box)}>
      <code {...stylex.props(styles.code, isPreformatted ? styles.preformatted : styles.wraps)}>
        {isPreformatted
          ? command
          : // A long path may break after any slash.
            command.split(/(?<=\/)/).map((part, index) => (
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
  wraps: {
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  },
  preformatted: {
    overflowX: 'auto',
    whiteSpace: 'pre',
  },
  button: {
    flexShrink: 0,
    width: 74,
    height: 32,
    borderRadius: 999,
    backgroundColor: { default: tokens.thumb, ':hover': tokens.thumbRaised },
    boxShadow: tokens.shadowThumb,
    color: colorVars['--color-text-primary'],
    fontSize: 13,
    fontWeight: 500,
    cursor: 'default',
    scale: { default: 1, ':active': 0.96 },
    transitionProperty: 'background-color, scale',
    transitionDuration: '150ms',
  },
});
