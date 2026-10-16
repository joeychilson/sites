import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import appIcon from '../src/assets/app-icon-dark.webp';
import Command from '../src/components/command' with { island: 'visible' };
import CommandList from '../src/components/command-list';
import CommandTabs from '../src/components/command-tabs' with { island: 'visible' };
import Download from '../src/components/download';
import FeatureList from '../src/components/feature-list';
import ForecastTiles from '../src/components/forecast-tiles';
import HeroScreen from '../src/components/hero-screen' with { island: 'load' };
import LogoRow from '../src/components/logo-row';
import MenuBarFigures from '../src/components/menu-bar-figures';
import PageSection from '../src/components/page-section';
import StatusLine from '../src/components/status-line';
import Terminal, { Turn } from '../src/components/terminal';
import {
  agents,
  cliCommands,
  installCommand,
  mcpTools,
  privacy,
  providers,
  statusLineSetups,
} from '../src/content';
import { site } from '../src/site';
import { layout } from '../src/styles/layout';
import { text } from '../src/styles/text';
import { media, tokens } from '../src/styles/tokens.stylex';

export default function Home() {
  return (
    <>
      <section aria-labelledby="hero-title" {...stylex.props(styles.hero)}>
        <h1 id="hero-title" {...stylex.props(text.headline, styles.headline, styles.enter)}>
          Know before you run out
        </h1>
        <p {...stylex.props(styles.lede, styles.enter, styles.second)}>
          A Mac menu bar app that shows what’s left of your coding agents’ usage limits, and whether
          they’ll last until they reset.
        </p>
        <div {...stylex.props(styles.enter, styles.third)}>
          <Download />
        </div>
        <div {...stylex.props(styles.screen, styles.enter, styles.third)}>
          <HeroScreen />
          <p {...stylex.props(styles.hint)}>Try it: open an account.</p>
        </div>
      </section>

      <div {...stylex.props(layout.column, styles.worksWith)}>
        <LogoRow title="Works with" names={agents} />
        <LogoRow title="Reads limits from" names={providers} />
      </div>

      <PageSection
        id="menu-bar"
        arrangement="stacked"
        title="At a glance"
        description="One number for each account in use, the most urgent first."
      >
        <MenuBarFigures />
      </PageSection>

      <PageSection
        id="forecasts"
        arrangement="stacked"
        title="Plan around your limits"
        description="Turnscope reads your agents’ history on your Mac and asks each provider for your limits, with nothing to set up."
      >
        <ForecastTiles />
      </PageSection>

      <PageSection
        id="agents"
        arrangement="split"
        title="Your agents can check too"
        description="Turnscope is also an MCP server, so agents can check their limits before a big job. Its tools only read."
        aside={
          <p {...stylex.props(styles.aside)}>
            <a href={`${site.repo}/blob/main/docs/mcp.md`} {...stylex.props(text.link)}>
              MCP docs
            </a>
          </p>
        }
      >
        <FeatureList features={mcpTools} columns="two" hasCodeTitles />
        <div {...stylex.props(styles.connect)}>
          <p {...stylex.props(text.body)}>Connect in Settings → Agents, or run:</p>
          <div {...stylex.props(styles.tabs)}>
            <CommandTabs
              id="connect"
              label="Agent"
              commands={agents.map((agent) => ({ label: agent.name, code: agent.connect }))}
            />
          </div>
        </div>
      </PageSection>

      <PageSection
        id="handoff"
        arrangement="split"
        isFlipped
        title="Hand off to another agent"
        description="When a limit runs out mid-task, another agent can pick up the work. Turnscope builds the handoff from the session files, without calling a model."
        aside={
          <p {...stylex.props(text.body, styles.aside)}>
            Use the <code {...stylex.props(text.code)}>handoff</code> tool, the{' '}
            <code {...stylex.props(text.code)}>continue</code> prompt or{' '}
            <code {...stylex.props(text.code)}>turnscope handoff</code>.
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
        arrangement="split"
        title="A status line and a guard"
        description={
          <>
            <code {...stylex.props(text.code)}>turnscope statusline</code> puts your limits in your
            agent’s status line. <code {...stylex.props(text.code)}>turnscope guard</code> lets a
            hook stop subagents when a limit runs low.
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
        arrangement="split"
        isFlipped
        title="The command line"
        description={
          <>
            It ships with the app. Add <code {...stylex.props(text.code)}>--json</code> to any
            command that prints data.
          </>
        }
        aside={
          <p {...stylex.props(styles.aside)}>
            <a href={`${site.repo}/blob/main/docs/cli.md`} {...stylex.props(text.link)}>
              CLI docs
            </a>
          </p>
        }
      >
        <CommandList commands={cliCommands} />
      </PageSection>

      <PageSection
        id="privacy"
        arrangement="stacked"
        title="Your history stays on your Mac"
        description="Turnscope only reads. The one change it makes is adding its MCP server to an agent, when you ask."
      >
        <FeatureList features={privacy} columns="three" />
      </PageSection>

      <section id="install" aria-labelledby="install-title" {...stylex.props(styles.install)}>
        <div {...stylex.props(layout.rise)}>
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
              Optional: add the command line to your <code {...stylex.props(text.code)}>PATH</code>:
            </li>
          </ol>
          <div {...stylex.props(styles.symlink)}>
            <Command command={installCommand} />
          </div>
        </div>
      </section>
    </>
  );
}

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
  // The hero settles in line by line as the page opens.
  enter: {
    animationName: { default: settle, [media.reducedMotion]: 'none' },
    animationDuration: '700ms',
    animationTimingFunction: tokens.easeOut,
    animationFillMode: 'both',
  },
  second: {
    animationDelay: '80ms',
  },
  third: {
    animationDelay: '160ms',
  },
  headline: {
    maxWidth: '12em',
    marginInline: 'auto',
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
