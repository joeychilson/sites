import { createFileRoute } from '@tanstack/react-router';

import appIcon from '@/assets/app-icon-dark.webp';
import { Command } from '@/components/command';
import { CommandList } from '@/components/command-list';
import { CommandTabs } from '@/components/command-tabs';
import { Download } from '@/components/download';
import { FeatureList } from '@/components/feature-list';
import { ForecastTiles } from '@/components/forecast-tiles';
import { HeroScreen } from '@/components/hero-screen';
import { LogoRow } from '@/components/logo-row';
import { MenuBarGlance } from '@/components/menu-bar-glance';
import { Section } from '@/components/section';
import { StatusLine } from '@/components/status-line';
import { Terminal, Turn } from '@/components/terminal';
import {
  agents,
  cliCommands,
  installCommand,
  mcpTools,
  privacy,
  providers,
  statusLineSetups,
} from '@/lib/content';
import { site } from '@/lib/site';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ property: 'og:url', content: `${site.origin}/` }],
    links: [{ rel: 'canonical', href: `${site.origin}/` }],
  }),
  component: Home,
});

const docsLink =
  'text-[15px] text-ink-secondary underline decoration-ink-fainter underline-offset-4 transition-colors hover:text-ink';

const code = 'text-[0.9em] text-ink';

const step =
  'relative mt-3.5 ps-10 [counter-increment:step] before:absolute before:top-0 before:left-0 before:grid before:size-[26px] before:place-items-center before:rounded-full before:bg-muted before:text-[13px] before:font-semibold before:text-ink before:content-[counter(step)]';

function Home() {
  return (
    <>
      <section aria-labelledby="hero-title" className="px-6 pt-20 text-center sm:pt-28">
        <h1 id="hero-title" className="mx-auto max-w-[12em] headline motion-safe:settle-0">
          Know before you run out
        </h1>
        <p className="mx-auto mt-6 max-w-[32em] text-[18px]/[1.6] text-pretty text-ink-secondary motion-safe:settle-1 sm:text-[20px]">
          A Mac menu bar app that shows what’s left of your coding agents’ usage limits, and whether
          they’ll last until they reset.
        </p>
        <div className="motion-safe:settle-2">
          <Download />
        </div>
        <div className="mt-18 motion-safe:settle-2">
          <HeroScreen />
          <p className="mt-5 text-[14px] text-ink-faint">Try it: open an account.</p>
        </div>
      </section>

      <div className="column mt-16 flex flex-col gap-4 sm:mt-20">
        <LogoRow title="Works with" names={agents} />
        <LogoRow title="Reads limits from" names={providers} />
      </div>

      <Section
        id="menu-bar"
        layout="stacked"
        title="At a glance"
        description="One number for each account in use, the most urgent first."
      >
        <MenuBarGlance />
      </Section>

      <Section
        id="forecasts"
        layout="stacked"
        title="Plan around your limits"
        description="Turnscope reads your agents’ history on your Mac and asks each provider for your limits, with nothing to set up."
      >
        <ForecastTiles />
      </Section>

      <Section
        id="agents"
        layout="text-left"
        title="Your agents can check too"
        description="Turnscope is also an MCP server, so agents can check their limits before a big job. Its tools only read."
        aside={
          <p className="mt-5">
            <a href={`${site.repo}/blob/main/docs/mcp.md`} className={docsLink}>
              MCP docs
            </a>
          </p>
        }
      >
        <FeatureList features={mcpTools} layout="two" titlesAreCode />
        <div className="mt-12">
          <p className="body-text">Connect in Settings → Agents, or run:</p>
          <div className="mt-5">
            <CommandTabs
              id="connect"
              label="Agent"
              setups={agents.map((agent) => ({ label: agent.name, code: agent.connect }))}
            />
          </div>
        </div>
      </Section>

      <Section
        id="handoff"
        layout="text-right"
        title="Hand off to another agent"
        description="When a limit runs out mid-task, another agent can pick up the work. Turnscope builds the handoff from the session files, without calling a model."
        aside={
          <p className="mt-5 body-text">
            Use the <code className={code}>handoff</code> tool, the{' '}
            <code className={code}>continue</code> prompt or{' '}
            <code className={code}>turnscope handoff</code>.
          </p>
        }
      >
        <Terminal title="app — codex">
          <Turn mark="›" kind="asked">
            Claude Code ran out. Pick up its work on the parser.
          </Turn>
          <Turn mark="•">
            Called <strong>turnscope.handoff</strong>({'{}'})
          </Turn>
          <Turn mark="└" kind="output">
            # Handoff: Fix the parser
            <br />
            <br />
            Claude Code session `claude-code:0f6e3f6a-713c-4d1e-9a6b-2b8c1d4e5f60` in `/work/app` on
            branch `main`, last active 08:01 (4m ago), 52 entries. Times are local; it's now Thu Oct
            8 08:05.
            <br />
            <span className="text-ink-faint">… +71 lines</span>
          </Turn>
          <Turn mark="•">
            Claude Code fixed nested tables and wrote two of the four test files. The third fails on
            inline tables, so I'll start there.
          </Turn>
        </Terminal>
      </Section>

      <Section
        id="status-line"
        layout="text-left"
        title="A status line and a guard"
        description={
          <>
            <code className={code}>turnscope statusline</code> puts your limits in your agent’s
            status line. <code className={code}>turnscope guard</code> lets a hook stop subagents
            when a limit runs low.
          </>
        }
      >
        <StatusLine />
        <div className="mt-5">
          <CommandTabs id="status-line-setup" label="Where" setups={statusLineSetups} />
        </div>
      </Section>

      <Section
        id="cli"
        layout="text-right"
        title="The command line"
        description={
          <>
            It ships with the app. Add <code className={code}>--json</code> to any command that
            prints data.
          </>
        }
        aside={
          <p className="mt-5">
            <a href={`${site.repo}/blob/main/docs/cli.md`} className={docsLink}>
              CLI docs
            </a>
          </p>
        }
      >
        <CommandList commands={cliCommands} />
      </Section>

      <Section
        id="privacy"
        layout="stacked"
        title="Your history stays on your Mac"
        description="Turnscope only reads. The one change it makes is adding its MCP server to an agent, when you ask."
      >
        <FeatureList features={privacy} layout="three" />
      </Section>

      <section
        id="install"
        aria-labelledby="install-title"
        className="mt-36 px-6 text-center sm:mt-48"
      >
        <div className="rise-in-view">
          <img src={appIcon} alt="" width={88} height={88} className="mx-auto" />
          <h2 id="install-title" className="mt-7 text-[30px] font-semibold tracking-[-0.03em]">
            {site.name}
          </h2>
          <Download />
          <ol className="mx-auto mt-14 max-w-160 text-start text-ink-secondary [counter-reset:step]">
            <li className={step}>Open the disk image and drag Turnscope to Applications.</li>
            <li className={step}>
              Open Turnscope. It lives in your menu bar and checks for updates on its own.
            </li>
            <li className={step}>
              Optional: add the command line to your <code className={code}>PATH</code>:
            </li>
          </ol>
          <div className="mx-auto mt-4 max-w-160">
            <Command code={installCommand} />
          </div>
        </div>
      </section>
    </>
  );
}
