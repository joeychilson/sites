import * as stylex from '@stylexjs/stylex';

export const media = stylex.defineConsts({
  wide: '@media (min-width: 40rem)',
  narrow: '@media (width < 40rem)',
  large: '@media (min-width: 64rem)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  scrollLinked: '@supports (animation-timeline: view())',
});

/** What the theme (theme/turnscope.ts) adds to Astryx's tokens. */
export const tokens = stylex.defineConsts({
  textFaint: 'var(--color-text-faint)',
  thumb: 'var(--color-thumb)',
  thumbRaised: 'var(--color-thumb-raised)',
  shadowThumb: 'var(--shadow-thumb)',
  label: 'var(--color-label)',
  labelSecondary: 'var(--color-label-secondary)',
  labelTertiary: 'var(--color-label-tertiary)',
  labelQuaternary: 'var(--color-label-quaternary)',
  rowHover: 'var(--color-row-hover)',
  glass: 'var(--color-glass)',
  window: 'var(--color-window)',
  shadowWindow: 'var(--shadow-window)',
  shadowWindowEdge: 'var(--shadow-window-edge)',
  shadowPanel: 'var(--shadow-panel)',
  shadowNotification: 'var(--shadow-notification)',
  easeSpring: 'var(--ease-spring)',
  easeOut: 'var(--ease-out)',
});

/**
 * The app's timings (macos/Turnscope/Style.swift): the spring everything moves on, new content
 * fading in once its space has opened and out at once, and a hover's fill.
 */
export const motion = stylex.defineConsts({
  spring: '400ms',
  appear: '160ms',
  vanish: '60ms',
  hover: '120ms',
});
