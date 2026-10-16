import * as stylex from '@stylexjs/stylex';

import { motion, tokens } from '../../../styles/tokens.stylex';

type PillButtonProps = {
  children: string;
  onClick: () => void;
  /** For one of a few choices: whether it's the chosen one, which alone is filled. */
  isPressed?: boolean;
  label?: string;
};

/** A small pill: a row's one action, filled, or one of a few choices, filled only when chosen. */
export default function PillButton({ children, onClick, isPressed, label }: PillButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isPressed}
      aria-label={label}
      onClick={onClick}
      {...stylex.props(styles.pill, isPressed === false ? styles.plain : styles.filled)}
    >
      {children}
    </button>
  );
}

const styles = stylex.create({
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    height: 22,
    paddingInline: 10,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    cursor: 'default',
    transitionProperty: 'background-color, color',
    transitionDuration: motion.hover,
    transitionTimingFunction: 'ease-out',
    outlineOffset: -2,
  },
  filled: {
    color: tokens.label,
    backgroundColor: {
      default: tokens.fill,
      ':hover': tokens.fillHover,
      ':active': tokens.fillPressed,
    },
  },
  plain: {
    color: { default: tokens.labelSecondary, ':hover': tokens.label },
    backgroundColor: {
      default: 'transparent',
      ':hover': tokens.fillHover,
      ':active': tokens.fillPressed,
    },
  },
});
