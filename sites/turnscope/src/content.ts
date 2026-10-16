import type { TabbedCommand } from './components/command-tabs';
import type { Feature } from './components/feature-list';
import type { Named } from './components/logo-row';
import { site } from './site';

/** Each agent's own command for adding Turnscope's MCP server, which Settings → Agents also runs. */
export const agents: Array<Named & { connect: string }> = [
  {
    name: 'Claude Code',
    logo: 'anthropic',
    connect: `claude mcp add --scope user turnscope -- ${site.executable} mcp`,
  },
  { name: 'Codex', logo: 'openai', connect: `codex mcp add turnscope -- ${site.executable} mcp` },
  {
    name: 'OpenCode',
    logo: 'opencode',
    connect: `opencode mcp add --global turnscope -- ${site.executable} mcp`,
  },
  { name: 'Pi', logo: 'pi', connect: `pi mcp add turnscope -- ${site.executable} mcp` },
  {
    name: 'Grok Build',
    logo: 'xai',
    connect: `grok mcp add --scope user turnscope ${site.executable} mcp`,
  },
];

export const providers: Array<Named> = [
  { name: 'Anthropic', plan: 'Claude', logo: 'anthropic' },
  { name: 'OpenAI', plan: 'ChatGPT', logo: 'openai' },
  { name: 'xAI', plan: 'SuperGrok', logo: 'xai' },
  { name: 'OpenCode Go', logo: 'opencode' },
  { name: 'OpenRouter', logo: 'openrouter' },
];

export const mcpTools: Array<Feature> = [
  { title: 'check_limits', text: 'Whether planned work fits, and which account has room.' },
  { title: 'explain_usage', text: 'What used a limit, or what it cost.' },
  { title: 'find_sessions', text: 'Search past sessions by text, folder, agent or time.' },
  { title: 'handoff', text: 'What another agent needs to finish a session.' },
  { title: 'read_session', text: 'Read a session page by page, or just what failed.' },
  { title: 'continue', tag: 'prompt', text: 'Start a new session from the last one’s handoff.' },
];

export const statusLineSetups: Array<TabbedCommand> = [
  {
    label: 'Claude Code',
    file: 'settings.json',
    code: `{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Agent",
      "hooks": [{
        "type": "command",
        "command": "turnscope guard --limit week --below 10"
      }]
    }]
  },
  "statusLine": {
    "type": "command",
    "command": "turnscope statusline"
  }
}`,
  },
  {
    label: 'tmux',
    file: '.tmux.conf',
    code: `set -g status-right '#(turnscope statusline)'\nset -g status-interval 60`,
  },
];

export const cliCommands = [
  { command: 'turnscope status', does: 'every limit, forecast and hour of work left' },
  { command: 'turnscope status --hours 3', does: 'whether 3 more hours of work fit' },
  { command: 'turnscope usage --by model', does: 'the last 30 days by model' },
  { command: 'turnscope sessions --since today', does: 'today’s sessions' },
  { command: 'turnscope doctor', does: 'what can’t be read, and how to fix it' },
];

export const privacy: Array<Feature> = [
  {
    title: 'No secrets kept',
    text: 'Each login goes only to its own provider. API keys are kept as fingerprints.',
  },
  {
    title: 'No telemetry',
    text: 'Besides your providers, it only talks to models.dev for prices and GitHub for updates.',
  },
  {
    title: 'No account',
    text: 'Nothing to sign up for. What it knows stays in a local database.',
  },
];

export const installCommand = `sudo mkdir -p /usr/local/bin\nsudo ln -sf ${site.executable} /usr/local/bin/turnscope`;
