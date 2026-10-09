export const site = {
  name: 'Turnscope',
  url: 'https://turnscope.app',
  title: 'Turnscope',
  description:
    'A free Mac menu bar app that tracks your coding agents’ usage limits. Works with Claude Code, Codex, OpenCode, Pi and Grok Build.',
  repo: 'https://github.com/joeychilson/turnscope',
  requires: 'macOS 26',
  author: { name: 'Joey Chilson', url: 'https://joeychilson.com' },
};

/** The command line inside the app, which agents start the MCP server with. */
export const executable = '/Applications/Turnscope.app/Contents/Helpers/turnscope';
