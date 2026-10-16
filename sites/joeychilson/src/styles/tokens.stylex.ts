import * as stylex from '@stylexjs/stylex';

/** The column's breakpoint and the condition motion depends on. */
export const media = stylex.defineConsts({
  wide: '@media (min-width: 40rem)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
});

/** The tokens this site's theme adds to Astryx's (theme/city.ts). */
export const tokens = stylex.defineConsts({
  pixelFont: 'var(--font-family-pixel)',
  easeOut: 'var(--ease-out)',
  /** 0 by day and 1 by night (global.css). */
  night: 'var(--night)',
});
