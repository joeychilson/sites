import * as stylex from '@stylexjs/stylex';

/** The page's breakpoints and the conditions motion depends on. */
export const media = stylex.defineConsts({
  wide: '@media (min-width: 40rem)',
  narrow: '@media (width < 40rem)',
  large: '@media (min-width: 64rem)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  motionOk: '@media (prefers-reduced-motion: no-preference)',
  scrollLinked: '@supports (animation-timeline: view())',
});

/** The tokens this site's theme adds to Astryx's (theme/turnscope.ts). */
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
  fill: 'var(--color-fill)',
  fillHover: 'var(--color-fill-hover)',
  fillPressed: 'var(--color-fill-pressed)',
  card: 'var(--color-card)',
  switchOff: 'var(--color-switch-off)',
  knob: 'var(--color-knob)',
  glass: 'var(--color-glass)',
  window: 'var(--color-window)',
  controlAccent: 'var(--color-control-accent)',
  easeSpring: 'var(--ease-spring)',
  easeOut: 'var(--ease-out)',
});

/**
 * The app's timings (macos/Turnscope/Style.swift): the spring everything moves on, new content
 * fading in once its space has opened and fading out at once, and a hover's fill.
 */
export const motion = stylex.defineConsts({
  spring: '400ms',
  appear: '160ms',
  vanish: '60ms',
  hover: '120ms',
});
