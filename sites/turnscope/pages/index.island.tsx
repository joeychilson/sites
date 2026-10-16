import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import appIcon from '../src/assets/app-icon-dark.webp';
import Column from '../src/components/column';
import CommandList from '../src/components/command-list';
import Download from '../src/components/download';
import FeatureList, { type Feature } from '../src/components/feature-list';
import ForecastTiles from '../src/components/forecast-tiles';
import LogoRow from '../src/components/logo-row';
import MenuBarFigures from '../src/components/menu-bar-figures';
import PageSection from '../src/components/page-section';
import StatusLine from '../src/components/status-line';
import Terminal from '../src/components/terminal';
import Turn from '../src/components/turn';
import Command from '../src/islands/command' with { island: 'visible' };
import CommandTabs from '../src/islands/command-tabs' with { island: 'visible' };
import type { TabbedCommand } from '../src/islands/command-tabs';
import HeroScreen from '../src/islands/hero-screen' with { island: 'load' };
import { EXECUTABLE, site } from '../src/site';
import { reveal } from '../src/styles/reveal';
import { media, tokens } from '../src/styles/tokens.stylex';

const agents = [
  { name: 'Claude Code', logo: 'anthropic' },
  { name: 'Codex', logo: 'openai' },
  { name: 'OpenCode', logo: 'opencode' },
  { name: 'Pi', logo: 'pi' },
  { name: 'Grok Build', logo: 'xai' },
] as const;

const providers = [
  { name: 'Anthropic', plan: 'Claude', logo: 'anthropic' },
  { name: 'OpenAI', plan: 'ChatGPT', logo: 'openai' },
  { name: 'xAI', plan: 'SuperGrok', logo: 'xai' },
  { name: 'OpenCode Go', logo: 'opencode-go' },
  { name: 'OpenRouter', logo: 'openrouter' },
] as const;

const tools: Array<Feature> = [
  { title: 'check_limits', text: 'Whether planned work fits, and which account has room.' },
  { title: 'explain_usage', text: 'What used a limit, or what it cost.' },
  { title: 'find_sessions', text: 'Search past sessions by text, folder, agent or time.' },
  { title: 'handoff', text: 'What another agent needs to finish a session.' },
  { title: 'read_session', text: 'Read a session page by page, or just what failed.' },
  { title: 'continue', tag: 'prompt', text: 'Start a new session from the last one’s handoff.' },
];

const privacy: Array<Feature> = [
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

// Each agent's own command for adding Turnscope, which Settings → Agents also runs.
const connectCommands: Array<TabbedCommand> = [
  { label: 'Claude Code', code: `claude mcp add --scope user turnscope -- ${EXECUTABLE} mcp` },
  { label: 'Codex', code: `codex mcp add turnscope -- ${EXECUTABLE} mcp` },
  { label: 'OpenCode', code: `opencode mcp add --global turnscope -- ${EXECUTABLE} mcp` },
  { label: 'Pi', code: `pi mcp add turnscope -- ${EXECUTABLE} mcp` },
  { label: 'Grok Build', code: `grok mcp add --scope user turnscope ${EXECUTABLE} mcp` },
];

// Where the status line can go: Claude Code's status line, with the guard as a hook, or
// anything that shows a command's output.
const statusLineSetups: Array<TabbedCommand> = [
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

const cliCommands = [
  { command: 'turnscope status', does: 'every limit, forecast and hour of work left' },
  { command: 'turnscope status --hours 3', does: 'whether 3 more hours of work fit' },
  { command: 'turnscope usage --by model', does: 'the last 30 days by model' },
  { command: 'turnscope sessions --since today', does: 'today’s sessions' },
  { command: 'turnscope doctor', does: 'what can’t be read, and how to fix it' },
];

export default function Home() {
  return (
    <>
      <section aria-labelledby="hero-title" {...stylex.props(styles.hero)}>
        <h1 id="hero-title" {...stylex.props(styles.headline, styles.enter)}>
          Know before you run out
        </h1>
        <p {...stylex.props(styles.lede, styles.enter, styles.enterLater)}>
          A Mac menu bar app that shows what’s left of your coding agents’ usage limits, and whether
          they’ll last until they reset.
        </p>
        <div {...stylex.props(styles.enter, styles.enterLast)}>
          <Download />
        </div>

        <div {...stylex.props(styles.screen, styles.enter, styles.enterLast)}>
          <HeroScreen />
          <p {...stylex.props(styles.hint)}>Try it: open an account, or click the gear.</p>
        </div>
      </section>

      <Column>
        <div {...stylex.props(styles.worksWith)}>
          <LogoRow title="Works with" names={agents} />
          <LogoRow title="Reads limits from" names={providers} />
        </div>
      </Column>

      <PageSection
        id="menu-bar"
        layout="stacked"
        title="At a glance"
        description="One number for each account in use, the most urgent first."
      >
        <MenuBarFigures />
      </PageSection>

      <PageSection
        id="forecasts"
        layout="stacked"
        title="Plan around your limits"
        description="Turnscope reads your agents’ history on your Mac and asks each provider for your limits, with nothing to set up."
      >
        <ForecastTiles />
      </PageSection>

      <PageSection
        id="agents"
        layout="split"
        title="Your agents can check too"
        description="Turnscope is also an MCP server, so agents can check their limits before a big job. Its tools only read."
        aside={
          <p {...stylex.props(styles.aside)}>
            <a href={`${site.repo}/blob/main/docs/mcp.md`} {...stylex.props(styles.link)}>
              MCP docs
            </a>
          </p>
        }
      >
        <FeatureList features={tools} columns="two" hasCodeTitles />
        <div {...stylex.props(styles.connect)}>
          <p {...stylex.props(styles.note)}>Connect in Settings → Agents, or run:</p>
          <div {...stylex.props(styles.tabs)}>
            <CommandTabs id="connect" label="Agent" commands={connectCommands} />
          </div>
        </div>
      </PageSection>

      <PageSection
        id="handoff"
        layout="split"
        isFlipped
        title="Hand off to another agent"
        description="When a limit runs out mid-task, another agent can pick up the work. Turnscope builds the handoff from the session files, without calling a model."
        aside={
          <p {...stylex.props(styles.aside, styles.note)}>
            Use the <code {...stylex.props(styles.code)}>handoff</code> tool, the{' '}
            <code {...stylex.props(styles.code)}>continue</code> prompt or{' '}
            <code {...stylex.props(styles.code)}>turnscope handoff</code>.
          </p>
        }
      >
        <Terminal title="app — codex">
          <Turn mark="›" isMuted>
            Claude Code ran out. Pick up its work on the parser.
          </Turn>
          <Turn mark="•">
            Called <strong>turnscope.handoff</strong>({'{}'})
          </Turn>
          <Turn mark="└" isOutput>
            # Handoff: Fix the parser
            <br />
            <br />
            Claude Code session `claude-code:0f6e3f6a-713c-4d1e-9a6b-2b8c1d4e5f60` in `/work/app` on
            branch `main`, last active 08:01 (4m ago), 52 entries. Times are local; it's now Thu Oct
            8 08:05.
            <br />
            <span {...stylex.props(styles.faint)}>… +71 lines</span>
          </Turn>
          <Turn mark="•">
            Claude Code fixed nested tables and wrote two of the four test files. The third fails on
            inline tables, so I'll start there.
          </Turn>
        </Terminal>
      </PageSection>

      <PageSection
        id="status-line"
        layout="split"
        title="A status line and a guard"
        description={
          <>
            <code {...stylex.props(styles.code)}>turnscope statusline</code> puts your limits in
            your agent’s status line. <code {...stylex.props(styles.code)}>turnscope guard</code>{' '}
            lets a hook stop subagents when a limit runs low.
          </>
        }
      >
        <StatusLine />
        <div {...stylex.props(styles.tabs)}>
          <CommandTabs id="status-line-setup" label="Where" commands={statusLineSetups} />
        </div>
      </PageSection>

      <PageSection
        id="cli"
        layout="split"
        isFlipped
        title="The command line"
        description={
          <>
            It ships with the app. Add <code {...stylex.props(styles.code)}>--json</code> to any
            command that prints data.
          </>
        }
        aside={
          <p {...stylex.props(styles.aside)}>
            <a href={`${site.repo}/blob/main/docs/cli.md`} {...stylex.props(styles.link)}>
              CLI docs
            </a>
          </p>
        }
      >
        <CommandList commands={cliCommands} />
      </PageSection>

      <PageSection
        id="privacy"
        layout="stacked"
        title="Your history stays on your Mac"
        description="Turnscope only reads. The one change it makes is adding its MCP server to an agent, when you ask."
      >
        <FeatureList features={privacy} columns="three" />
      </PageSection>

      <section id="install" aria-labelledby="install-title" {...stylex.props(styles.install)}>
        <div {...stylex.props(reveal.rise)}>
          <img src={appIcon} alt="" width={88} height={88} {...stylex.props(styles.appIcon)} />
          <h2 id="install-title" {...stylex.props(styles.installTitle)}>
            {site.name}
          </h2>
          <Download />
          <ol {...stylex.props(styles.steps)}>
            <li {...stylex.props(styles.step)}>
              Open the disk image and drag Turnscope to Applications.
            </li>
            <li {...stylex.props(styles.step)}>
              Open Turnscope. It lives in your menu bar and checks for updates on its own.
            </li>
            <li {...stylex.props(styles.step)}>
              Optional: add the command line to your{' '}
              <code {...stylex.props(styles.code)}>PATH</code>:
            </li>
          </ol>
          <div {...stylex.props(styles.symlink)}>
            <Command
              command={`sudo mkdir -p /usr/local/bin\nsudo ln -sf ${EXECUTABLE} /usr/local/bin/turnscope`}
            />
          </div>
        </div>
      </section>
    </>
  );
}

// The hero settles in on load: the headline first, then the rest.
const settle = stylex.keyframes({
  from: { opacity: 0, translate: '0 16px' },
  to: { opacity: 1, translate: 'none' },
});

const styles = stylex.create({
  hero: {
    paddingInline: 24,
    paddingTop: { default: 80, [media.wide]: 112 },
    textAlign: 'center',
  },
  enter: {
    animationName: { default: settle, [media.reducedMotion]: 'none' },
    animationDuration: '700ms',
    animationTimingFunction: tokens.easeOut,
    animationFillMode: 'both',
  },
  enterLater: {
    animationDelay: '80ms',
  },
  enterLast: {
    animationDelay: '160ms',
  },
  headline: {
    maxWidth: '12em',
    marginInline: 'auto',
    fontSize: { default: 42, [media.wide]: 64 },
    lineHeight: 1.02,
    fontWeight: 600,
    letterSpacing: '-0.045em',
    textWrap: 'balance',
  },
  lede: {
    maxWidth: '32em',
    marginTop: 24,
    marginInline: 'auto',
    fontSize: { default: 18, [media.wide]: 20 },
    lineHeight: 1.6,
    color: colorVars['--color-text-secondary'],
    textWrap: 'pretty',
  },
  screen: {
    marginTop: 72,
  },
  hint: {
    marginTop: 20,
    fontSize: 14,
    lineHeight: 1.5,
    color: colorVars['--color-text-disabled'],
  },
  faint: {
    color: colorVars['--color-text-disabled'],
  },
  worksWith: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginTop: { default: 64, [media.wide]: 80 },
  },
  aside: {
    marginTop: 20,
  },
  note: {
    fontSize: 15,
    lineHeight: 1.6,
    color: colorVars['--color-text-secondary'],
    textWrap: 'pretty',
  },
  link: {
    fontSize: 15,
    color: {
      default: colorVars['--color-text-secondary'],
      ':hover': colorVars['--color-text-primary'],
    },
    textDecorationLine: 'underline',
    textDecorationColor: tokens.textFaint,
    textUnderlineOffset: 4,
    transitionProperty: 'color',
    transitionDuration: '150ms',
  },
  code: {
    fontSize: '0.9em',
    lineHeight: 'inherit',
    color: colorVars['--color-text-primary'],
  },
  connect: {
    marginTop: 48,
  },
  tabs: {
    marginTop: 20,
  },
  install: {
    marginTop: { default: 144, [media.wide]: 192 },
    paddingInline: 24,
    textAlign: 'center',
  },
  appIcon: {
    width: 88,
    height: 88,
    marginInline: 'auto',
  },
  installTitle: {
    marginTop: 28,
    fontSize: 30,
    lineHeight: 1.5,
    fontWeight: 600,
    letterSpacing: '-0.03em',
  },
  steps: {
    maxWidth: 640,
    marginTop: 56,
    marginInline: 'auto',
    fontSize: 16,
    lineHeight: 1.5,
    textAlign: 'start',
    color: colorVars['--color-text-secondary'],
    counterReset: 'step',
  },
  step: {
    position: 'relative',
    marginTop: 14,
    paddingInlineStart: 40,
    counterIncrement: 'step',
    '::before': {
      content: 'counter(step)',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'grid',
      placeItems: 'center',
      width: 26,
      height: 26,
      borderRadius: '50%',
      backgroundColor: colorVars['--color-background-muted'],
      color: colorVars['--color-text-primary'],
      fontSize: 13,
      fontWeight: 600,
    },
  },
  symlink: {
    maxWidth: 640,
    marginTop: 16,
    marginInline: 'auto',
  },
});
