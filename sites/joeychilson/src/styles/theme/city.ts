import { defineTheme } from '@astryxdesign/core/theme';

// Day and night: near-black on white, or the other way around.
export const cityTheme = defineTheme({
  name: 'city',
  typography: {
    scale: { base: 15, ratio: 1.2 },
    body: {
      family: 'Inter Variable',
      fallbacks: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    },
    code: {
      family: 'ui-monospace',
      fallbacks: "'SF Mono', SFMono-Regular, Menlo, Consolas, monospace",
    },
  },
  tokens: {
    '--color-background-body': ['#fdfdfc', '#111111'],
    '--color-background-muted': ['rgb(0 0 0 / 0.04)', 'rgb(255 255 255 / 0.06)'],
    '--color-text-primary': ['#161616', '#ededed'],
    '--color-text-secondary': ['rgb(0 0 0 / 0.62)', 'rgb(255 255 255 / 0.62)'],
    '--color-text-disabled': ['rgb(0 0 0 / 0.45)', 'rgb(255 255 255 / 0.45)'],
    '--color-border': ['rgb(0 0 0 / 0.16)', 'rgb(255 255 255 / 0.2)'],
    '--focus-outline-color': ['rgb(0 0 0 / 0.45)', 'rgb(255 255 255 / 0.45)'],
  },
  localTokens: {
    '--font-family-pixel': "'Departure Mono', ui-monospace, monospace",
    '--ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
});
