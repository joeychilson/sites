import * as stylex from '@stylexjs/stylex';

export const a11y = stylex.create({
  /** Read by screen readers but not shown. */
  visuallyHidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
});
