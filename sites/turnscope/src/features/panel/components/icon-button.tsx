import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import { tokens } from '../../../styles/tokens.stylex';

type IconButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

/** A small icon button that fills on hover and more when pressed, like the system's toolbar buttons. */
export default function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      {...stylex.props(styles.button)}
    >
      {children}
    </button>
  );
}

const styles = stylex.create({
  button: {
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: 7,
    color: {
      default: tokens.labelSecondary,
      ':hover': tokens.label,
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': tokens.fill,
      ':active': tokens.fillHover,
    },
    cursor: 'default',
    transitionProperty: 'background-color, color',
    transitionDuration: '100ms',
    transitionTimingFunction: 'ease-out',
    outlineOffset: -2,
  },
});
