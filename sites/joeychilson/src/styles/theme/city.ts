import { defineTheme } from '@astryxdesign/core/theme';
import { defineSyntaxTheme } from '@astryxdesign/core/theme/syntax';

/** A color by day, then by night. */
type Pair = [day: string, night: string];

const muted: Pair = ['rgb(0 0 0 / 0.04)', 'rgb(255 255 255 / 0.06)'];

// Code is drawn in the city's colors: the lamps' amber for keywords, the sun's orange for numbers and
// the moon's blue for strings, deepened by day to read on white.
const amber: Pair = ['#a15c05', '#f4c36a'];
const orange: Pair = ['#bd4a1c', '#f39a6b'];
const blue: Pair = ['#3c6591', '#a9b8cf'];
const text: Pair = ['#262626', '#dedede'];
const quiet: Pair = ['#8c8c8c', '#888888'];
const slate: Pair = ['#56627a', '#c6ccd8'];

const citySyntax = defineSyntaxTheme({
  name: 'city',
  tokens: {
    keyword: amber,
    tag: amber,
    string: blue,
    number: orange,
    constant: orange,
    comment: ['#999999', '#6f6f6f'],
    function: ['#000000', '#ffffff'],
    type: slate,
    attribute: slate,
    variable: text,
    property: text,
    operator: quiet,
    punctuation: quiet,
    background: muted,
    'added-marker': blue,
    'removed-marker': orange,
  },
});

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
  syntax: citySyntax,
  tokens: {
    '--color-background-body': ['#fdfdfc', '#111111'],
    '--color-background-muted': muted,
    '--color-text-primary': ['#161616', '#ededed'],
    '--color-text-secondary': ['rgb(0 0 0 / 0.62)', 'rgb(255 255 255 / 0.62)'],
    '--color-text-disabled': ['rgb(0 0 0 / 0.45)', 'rgb(255 255 255 / 0.45)'],
    '--color-border': ['rgb(0 0 0 / 0.16)', 'rgb(255 255 255 / 0.2)'],
    '--focus-outline-color': ['rgb(0 0 0 / 0.45)', 'rgb(255 255 255 / 0.45)'],
  },
  localTokens: {
    '--font-family-pixel': "'Departure Mono', ui-monospace, monospace",
    '--ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
    '--color-selection': ['rgb(0 0 0 / 0.1)', 'rgb(255 255 255 / 0.18)'],
  },
});
