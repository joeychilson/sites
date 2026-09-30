export const site = {
  name: 'Turnscope',
  url: 'https://turnscope.app',
  title: 'Turnscope — Know if your coding agents’ limits will last',
  description:
    'A menu bar app that says whether your coding agents’ limits will last, and an MCP server so they can pace themselves. Free for Mac, for Claude Code, Codex, OpenCode, Pi and Grok Build.',
  repo: 'https://github.com/joeychilson/turnscope',
  requires: 'macOS 26 or later',
  author: { name: 'Joey Chilson', url: 'https://joeychilson.com' },
};

/** The command line inside the app, which agents start the MCP server with. */
export const executable = '/Applications/Turnscope.app/Contents/Helpers/turnscope';
