import type { LogoName } from '@/components/logo';
import { site } from '@/lib/site';

export interface Feature {
  title: string;
  tag?: string;
  text: string;
}

export interface Setup {
  label: string;
  code: string;
  file?: string;
}

// The commands the app's Settings → Agents runs, so keep the two in step.
export const agents: { name: string; logo: LogoName; connect: string }[] = [
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

export const providers: { name: string; plan?: string; logo: LogoName }[] = [
  { name: 'Anthropic', plan: 'Claude', logo: 'anthropic' },
  { name: 'OpenAI', plan: 'ChatGPT', logo: 'openai' },
  { name: 'xAI', plan: 'SuperGrok', logo: 'xai' },
  { name: 'OpenCode Go', logo: 'opencode' },
  { name: 'OpenRouter', logo: 'openrouter' },
];

export const mcpTools: Feature[] = [
  { title: 'check_limits', text: 'Whether planned work fits, and which account has room.' },
  { title: 'explain_usage', text: 'What used a limit, or what it cost.' },
  { title: 'find_sessions', text: 'Search past sessions by text, folder, agent or time.' },
  { title: 'handoff', text: 'What another agent needs to finish a session.' },
  { title: 'read_session', text: 'Read a session page by page, or just what failed.' },
  { title: 'continue', tag: 'prompt', text: 'Start a new session from the last one’s handoff.' },
];

export const statusLineSetups: Setup[] = [
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
    code: `set -g status-right '#(turnscope statusline)'
set -g status-interval 60`,
  },
];

export const cliCommands = [
  { command: 'turnscope status', does: 'every limit, forecast and hour of work left' },
  { command: 'turnscope status --hours 3', does: 'whether 3 more hours of work fit' },
  { command: 'turnscope usage --by model', does: 'the last 30 days by model' },
  { command: 'turnscope sessions --since today', does: 'today’s sessions' },
  { command: 'turnscope doctor', does: 'what can’t be read, and how to fix it' },
];

export const privacy: Feature[] = [
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

export const installCommand = `sudo mkdir -p /usr/local/bin
sudo ln -sf ${site.executable} /usr/local/bin/turnscope`;
