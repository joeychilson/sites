import { defineTheme } from '@astryxdesign/core/theme';

// Dark only, in the colors of the app's dark mode.
export const turnscopeTheme = defineTheme({
  name: 'turnscope',
  typography: {
    scale: { base: 16, ratio: 1.25 },
    body: {
      family: '-apple-system',
      fallbacks: "BlinkMacSystemFont, 'SF Pro Text', system-ui, 'Segoe UI', Roboto, sans-serif",
    },
    heading: { weight: 'semibold' },
    code: {
      family: 'ui-monospace',
      fallbacks: "'SF Mono', SFMono-Regular, Menlo, Consolas, monospace",
    },
  },
  tokens: {
    '--color-background-body': '#000000',
    '--color-background-muted': 'rgb(245 245 247 / 0.07)',
    '--color-background-popover': '#262628',
    '--color-text-primary': '#f5f5f7',
    '--color-text-secondary': 'rgb(245 245 247 / 0.6)',
    '--color-text-disabled': 'rgb(245 245 247 / 0.4)',
    '--color-accent': '#f5f5f7',
    '--color-on-accent': '#1d1d1f',
    '--color-warning': '#ed941a',
    '--color-error': '#fe8375',
    '--color-success': '#45b86e',
    '--focus-outline-color': 'rgb(76 155 255 / 0.7)',
  },
  localTokens: {
    '--color-text-faint': 'rgb(245 245 247 / 0.18)',
    '--color-selection': 'rgb(76 155 255 / 0.3)',
    // A segmented control's raised thumb, and a button's.
    '--color-thumb': '#48484b',
    '--color-thumb-raised': '#3a3a3d',
    '--shadow-thumb': '0 0 0 0.5px rgb(245 245 247 / 0.12), 0 1px 3px rgb(0 0 0 / 0.4)',
    // The app's own colors: macOS label colors, a row's hover fill, and the panel's glass.
    '--color-label': 'rgb(255 255 255 / 0.85)',
    '--color-label-secondary': 'rgb(255 255 255 / 0.55)',
    '--color-label-tertiary': 'rgb(255 255 255 / 0.25)',
    '--color-label-quaternary': 'rgb(255 255 255 / 0.1)',
    '--color-row-hover': 'rgb(255 255 255 / 0.06)',
    '--color-glass': 'rgb(34 34 36 / 0.7)',
    '--color-window': '#1c1c1e',
    // The edges and shadows of a window, the panel and a notification.
    '--shadow-window': '0 0 0 0.5px rgb(255 255 255 / 0.14), 0 24px 70px rgb(0 0 0 / 0.55)',
    '--shadow-window-edge': '0 0 0 0.5px rgb(255 255 255 / 0.14)',
    '--shadow-panel':
      'inset 0 0 0 0.5px rgb(255 255 255 / 0.12), inset 0 1px 0 rgb(255 255 255 / 0.08), 0 8px 36px rgb(0 0 0 / 0.45)',
    '--shadow-notification':
      'inset 0 0 0 0.5px rgb(255 255 255 / 0.12), 0 8px 24px rgb(0 0 0 / 0.35)',
    // The app's one spring, SwiftUI's spring(response: 0.34, dampingFraction: 0.9), sampled over 400ms.
    '--ease-spring':
      'linear(0, 0.081, 0.247, 0.427, 0.586, 0.715, 0.811, 0.88, 0.927, 0.958, 0.978, 0.989, 0.996, 0.999, 1)',
    '--ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
});
