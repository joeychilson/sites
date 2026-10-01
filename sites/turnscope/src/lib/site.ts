export const site = {
  name: 'Turnscope',
  url: 'https://turnscope.app',
  title: 'Turnscope — Know if your coding agents’ limits will last',
  description:
    'A free Mac menu bar app that shows what’s left of your subscription’s limits and whether it’ll last at your pace, with an MCP server your coding agents can ask too. For Claude Code, Codex, OpenCode, Pi and Grok Build.',
  repo: 'https://github.com/joeychilson/turnscope',
  requires: 'macOS 26 or later',
  author: { name: 'Joey Chilson', url: 'https://joeychilson.com' },
};

/** The command line inside the app, which agents start the MCP server with. */
export const executable = '/Applications/Turnscope.app/Contents/Helpers/turnscope';
