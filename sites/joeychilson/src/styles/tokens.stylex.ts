import * as stylex from '@stylexjs/stylex';

export const media = stylex.defineConsts({
  wide: '@media (min-width: 40rem)',
  noHover: '@media (hover: none)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
});

/** What the city theme (theme/city.ts) and global.css add to Astryx's tokens. */
export const city = stylex.defineConsts({
  pixelFont: 'var(--font-family-pixel)',
  easeOut: 'var(--ease-out)',
  /** 0 by day and 1 by night. */
  night: 'var(--night)',
  codeBackground: 'var(--color-syntax-background)',
  codeText: 'var(--color-syntax-variable)',
});
