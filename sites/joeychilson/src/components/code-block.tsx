import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import { text } from '../styles/text';
import { city } from '../styles/tokens.stylex';

type CodeBlockProps = {
  /** The fence's language, after its opening backticks. */
  language?: string;
  /** From `[name]` after the language, shown in its place. */
  filename?: string;
  /** The highlighted code. */
  children: ReactNode;
  /** In the block's top corner, shown while it's hovered. */
  action?: ReactNode;
};

export default function CodeBlock({ language, filename, children, action }: CodeBlockProps) {
  const caption = filename ?? language;
  return (
    <figure {...stylex.props(styles.block, stylex.defaultMarker())}>
      {caption && <figcaption {...stylex.props(text.pixel, styles.caption)}>{caption}</figcaption>}
      <pre {...stylex.props(styles.code, caption ? styles.underCaption : styles.alone)}>
        {children}
      </pre>
      {action}
    </figure>
  );
}

const styles = stylex.create({
  block: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: city.codeBackground,
  },
  caption: {
    display: 'block',
    paddingTop: 12,
    paddingInline: 16,
  },
  // A one-column grid makes the code a block at least as wide as the box, so a marked line's tint
  // reaches past the end of the longest line when it scrolls.
  code: {
    display: 'grid',
    gridTemplateColumns: 'minmax(100%, max-content)',
    paddingInline: 16,
    paddingBottom: 14,
    overflowX: 'auto',
    color: city.codeText,
    letterSpacing: 0,
    // The reset sizes <pre> and <code> from these, so the <code> inside follows.
    '--text-code-size': '13px',
    '--text-code-leading': 1.7,
  },
  underCaption: {
    paddingTop: 10,
  },
  alone: {
    paddingTop: 14,
  },
});
