import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';

import { text } from '../styles/text';
import { media } from '../styles/tokens.stylex';

type CopyButtonProps = {
  value: string;
};

// Sits in the corner of the nearest default-marked block, showing while it's hovered.
export default function CopyButton({ value }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setIsCopied(true);
    // Copying again starts the wait over.
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        {...stylex.props(text.pixel, styles.button, isCopied && styles.copied)}
      >
        {isCopied ? 'Copied' : 'Copy'}
      </button>
      <span aria-live="polite" {...stylex.props(styles.announcement)}>
        {isCopied ? 'Copied to the clipboard' : ''}
      </span>
    </>
  );
}

const styles = stylex.create({
  button: {
    position: 'absolute',
    top: 6,
    right: 8,
    paddingBlock: 6,
    paddingInline: 8,
    borderRadius: 6,
    color: {
      default: colorVars['--color-text-disabled'],
      ':hover': colorVars['--color-text-primary'],
    },
    cursor: 'pointer',
    opacity: {
      default: 0,
      [stylex.when.ancestor(':hover')]: 1,
      ':focus-visible': 1,
      [media.noHover]: 1,
    },
    transitionProperty: 'opacity, color',
    transitionDuration: '150ms',
  },
  copied: {
    opacity: 1,
  },
  announcement: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
});
