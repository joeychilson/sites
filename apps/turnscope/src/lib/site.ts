export const site = {
  name: 'Turnscope',
  origin: 'https://turnscope.app',
  description:
    'A free Mac menu bar app that tracks your coding agents’ usage limits. Works with Claude Code, Codex, OpenCode, Pi and Grok Build.',
  card: {
    path: '/social-card.png',
    alt: 'A Mac’s screen: Claude Code asks Turnscope whether 2 hours of work fit, and Turnscope’s panel is open from the menu bar. Claude Max runs out in 1 hour, in amber, with each of its limits shown.',
  },
  repo: 'https://github.com/joeychilson/turnscope',
  requires: 'macOS 26',
  executable: '/Applications/Turnscope.app/Contents/Helpers/turnscope',
  author: { name: 'Joey Chilson', href: 'https://joeychilson.com' },
};
