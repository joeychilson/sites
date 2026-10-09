<script lang="ts">
  import appIcon from '#lib/assets/app-icon-dark.webp';
  import type { Standing } from '#lib/components/Bar.svelte';
  import Command from '#lib/components/Command.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import Header from '#lib/components/Header.svelte';
  import Icon, { type IconName } from '#lib/components/Icon.svelte';
  import Logo, { type LogoName } from '#lib/components/Logo.svelte';
  import MacScreen from '#lib/components/MacScreen.svelte';
  import Panel from '#lib/components/Panel.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import Tabs from '#lib/components/Tabs.svelte';
  import Terminal from '#lib/components/Terminal.svelte';
  import { executable, site } from '#lib/site.js';

  const agents: { name: string; logo: LogoName }[] = [
    { name: 'Claude Code', logo: 'anthropic' },
    { name: 'Codex', logo: 'openai' },
    { name: 'OpenCode', logo: 'opencode' },
    { name: 'Pi', logo: 'pi' },
    { name: 'Grok Build', logo: 'xai' },
  ];

  const providers: { name: string; plan?: string; logo: LogoName }[] = [
    { name: 'Anthropic', plan: 'Claude', logo: 'anthropic' },
    { name: 'OpenAI', plan: 'ChatGPT', logo: 'openai' },
    { name: 'xAI', plan: 'SuperGrok', logo: 'xai' },
    { name: 'OpenCode Go', logo: 'opencode-go' },
    { name: 'OpenRouter', logo: 'openrouter' },
  ];

  /** A tile: an icon, a title, and a sentence under them. */
  type Tile = { icon: IconName; title: string; tag?: string; text: string };

  // The menu bar item's three figures (MenuBarItem.swift in the Turnscope repo).
  const states: { figure: string; state: Standing; text: string }[] = [
    { figure: '68%', state: 'lasts', text: 'Will last until it resets. Shows what’s left.' },
    { figure: '1h 40m', state: 'short', text: 'Will run out before it resets. Counts down the last 3 hours.' },
    { figure: 'Back 5:40 AM', state: 'out', text: 'Used up. Shows when it’s back.' },
  ];

  const features: Tile[] = [
    {
      icon: 'clock',
      title: 'When it runs out',
      text: 'Whether each limit will last until it resets, or when it’ll run out at your current pace.',
    },
    {
      icon: 'hourglass',
      title: 'Hours of work left',
      text: 'How many hours of agent work you have left, with an 80% range. Counts time your agents spend working, not the clock.',
    },
    {
      icon: 'pie',
      title: 'What used it',
      text: 'Usage and cost by session, project, model, agent or account, at list prices.',
    },
    {
      icon: 'bell',
      title: 'Notifications',
      text: 'When a limit is about to run out, runs out or comes back, and when an account needs you to sign in again.',
    },
  ];

  // What each tool is for.
  const tools: Tile[] = [
    { icon: 'gauge', title: 'check_limits', text: 'Whether planned work will fit, and which account has room.' },
    { icon: 'bars', title: 'explain_usage', text: 'What used a limit, or what your agents cost.' },
    { icon: 'search', title: 'find_sessions', text: 'Search any session on your Mac by text, folder, agent or time.' },
    { icon: 'forward', title: 'handoff', text: 'Everything another agent needs to finish a session’s work.' },
    { icon: 'page', title: 'read_session', text: 'Read a session page by page, or just what failed.' },
    { icon: 'play', title: 'continue', tag: 'prompt', text: 'Start a new session from the last one’s handoff.' },
  ];

  const privacy: Tile[] = [
    { icon: 'lock', title: 'No secrets kept', text: 'Each login is only sent to its own provider. API keys are stored as fingerprints, never in full.' },
    { icon: 'unseen', title: 'No telemetry', text: 'Other than your providers, it only talks to models.dev for prices and GitHub for updates.' },
    { icon: 'nobody', title: 'No account', text: 'Nothing to sign up for. Everything it knows stays in a local database.' },
  ];

  // Each agent's own command for adding Turnscope (docs/mcp.md), which
  // `turnscope connect` and Settings → Agents run.
  const clients = [
    { value: 'claude-code', label: 'Claude Code', command: `claude mcp add --scope user turnscope -- ${executable} mcp` },
    { value: 'codex', label: 'Codex', command: `codex mcp add turnscope -- ${executable} mcp` },
    { value: 'opencode', label: 'OpenCode', command: `opencode mcp add --global turnscope -- ${executable} mcp` },
    { value: 'pi', label: 'Pi', command: `pi mcp add turnscope -- ${executable} mcp` },
    { value: 'grok-build', label: 'Grok Build', command: `grok mcp add --scope user turnscope ${executable} mcp` },
  ] as const;

  let client = $state<(typeof clients)[number]['value']>('claude-code');

  // The README's quick start.
  const commands = [
    { command: 'turnscope status', does: 'every account’s limits, forecasts and work left' },
    { command: 'turnscope status --hours 3', does: 'whether 3 more hours of work fit' },
    { command: 'turnscope usage --by model', does: 'the last 30 days by model, at list prices' },
    { command: 'turnscope usage --limit week', does: 'what used your weekly limit' },
    { command: 'turnscope sessions --since today', does: 'today’s sessions' },
    { command: 'turnscope handoff', does: 'a handoff of the latest session in this folder' },
    { command: 'turnscope doctor', does: 'what can’t be read, and how to fix it' },
  ];

  const settings = `{
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
}`;

  // Where the status line can go: Claude Code's status line, with the guard
  // as a hook, or anything that shows a command's output.
  const lines = [
    { value: 'claude-code', label: 'Claude Code', caption: 'Add to', file: 'settings.json', text: settings },
    {
      value: 'tmux',
      label: 'tmux',
      caption: 'Add to',
      file: '.tmux.conf',
      text: `set -g status-right '#(turnscope statusline)'\nset -g status-interval 60`,
    },
  ] as const;

  let line = $state<(typeof lines)[number]['value']>('claude-code');

  const link = `sudo mkdir -p /usr/local/bin\nsudo ln -sf ${executable} /usr/local/bin/turnscope`;
</script>

<Seo
  schema={{
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/social-card.png`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: site.requires,
    downloadUrl: `${site.url}/download`,
    license: 'https://opensource.org/licenses/MIT',
    author: { '@type': 'Person', name: site.author.name, url: site.author.url },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }}
/>

<Header />

<main id="main">
  <section class="px-6 pt-36 text-center sm:pt-44">
    <h1
      class="mx-auto max-w-[12em] text-[42px] leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-[64px]"
    >
      Know before you run out
    </h1>
    <p class="mx-auto mt-6 max-w-[32em] text-[18px] leading-relaxed text-ink-2 text-pretty sm:text-[20px]">
      A menu bar app that shows what’s left of your coding agents’ usage limits and whether they’ll last
      until they reset.
    </p>
    {@render download()}

    <div class="mt-20">
      <MacScreen
        app="Terminal"
        item={{ figure: '1h', state: 'short' }}
        clock="Thu Oct 8 7:00 AM"
        label="A Mac at 7 AM. Asked to use subagents, Claude Code asks Turnscope whether 2 hours of work fit. About 1 hour 10 minutes of work is left before its 5-hour limit runs out, so it writes the tests itself. Turnscope's panel, open from the menu bar, says Claude Max runs out in 1 hour and is back in 3, and shows each of its limits."
      >
        <div class="absolute top-[110px] left-[48px] w-[560px]">
          <Terminal title="app — claude">
            <p class="turn text-ink-2"><span class="text-ink-3">&gt;</span><span>Use subagents to write the parser's tests.</span></p>
            <p class="turn mt-4"><span>●</span><span><span class="font-bold">turnscope - check_limits</span> (MCP)(hours: 2)</span></p>
            <p class="turn out text-ink-2">
              <span class="text-ink-3">⎿</span><span
                >2 more hours of work don't fit: 5 hours runs out after about 1h 10m of work.<br />Claude Max
                (me@example.com): about 1h 10m of work left (40m–2h 10m) before 5 hours runs out; it resets 10:00 (in
                3h).<br /><span class="text-ink-3">… +5 lines (ctrl+o to expand)</span></span
              >
            </p>
            <p class="turn mt-4"><span>●</span><span>That's about an hour of work, too little for subagents. I'll write the tests myself.</span></p>
          </Terminal>
        </div>
        <!-- Under the menu bar item, as App.swift places it. -->
        <div class="absolute top-[38px] right-[73px]"><Panel /></div>
        {#snippet compact()}<Panel />{/snippet}
      </MacScreen>
    </div>

    <p class="mt-12 text-[14px] text-ink-3">
      Works with
      {#each agents as agent, index (agent.name)}
        <span class="text-ink-2">{agent.name}</span>{index < agents.length - 2 ? ', ' : index === agents.length - 2 ? ' and ' : '.'}
      {/each}
    </p>
  </section>

  <section class="column mt-36 sm:mt-48" aria-labelledby="menu-bar">
    {@render heading('menu-bar', 'At a glance', 'Each account you’re using gets one number in the menu bar. The most urgent comes first.')}
    <ul class="mt-14 grid gap-12 sm:grid-cols-3 sm:gap-8">
      {#each states as item (item.state)}
        <li class="text-center">
          <p
            class={[
              'mac inline-flex items-center gap-2.5 text-[32px] font-medium tracking-[-0.02em] whitespace-nowrap tabular-nums sm:text-[36px]',
              item.state === 'short' && 'text-amber',
              item.state === 'out' && 'text-red',
            ]}
          >
            <Logo name="anthropic" class="size-7 text-ink" />{item.figure}
          </p>
          <p class="mx-auto mt-4 max-w-[16em] text-[16px] text-ink-2">{item.text}</p>
        </li>
      {/each}
    </ul>
  </section>

  <section class="column mt-36 sm:mt-48" aria-labelledby="tells">
    {@render heading('tells', 'Plan around your limits', 'Turnscope reads what your agents already store on your Mac and asks each provider for your limits. Nothing to set up.')}
    {@render tiles(features, 'sm:grid-cols-2')}
  </section>

  <section id="agents" class="column mt-36 scroll-mt-8 sm:mt-48" aria-labelledby="agents-title">
    {@render heading('agents-title', 'Your agents can check too', 'Turnscope is also an MCP server, so agents can check their own limits before taking on big jobs. Every tool is read-only.')}
    {@render tiles(tools, 'sm:grid-cols-2 lg:grid-cols-3', true)}
    <div class="mx-auto mt-16 flex max-w-[760px] flex-col items-center">
      <p class="text-center text-[15px] text-ink-2">
        Connect from Settings → Agents, or run:
      </p>
      <div class="mt-5 flex w-full flex-col items-center">
        <Tabs label="Agent" options={clients} bind:value={client}>
          {#snippet panel(option)}
            <Command command={option.command} class="mt-4 w-[min(760px,calc(100vw-40px))] text-left" />
          {/snippet}
        </Tabs>
      </div>
      <p class="mt-6 text-center text-[14px] text-ink-3">
        <a class="text-ink-2 underline decoration-ink-4 underline-offset-4 transition-colors hover:text-ink" href="{site.repo}/blob/main/docs/mcp.md">
          MCP docs
        </a>
      </p>
    </div>
  </section>

  <section class="column mt-36 sm:mt-48" aria-labelledby="handoff">
    {@render heading('handoff', 'Hand off to another agent', 'When a limit runs out mid-task, another agent can finish the job. The handoff covers what you asked for, what got done and where it stopped. Turnscope builds it from the session files without calling a model.')}
    <div class="mx-auto mt-14 max-w-[760px] text-left">
      <Terminal title="app — codex">
        <p class="turn text-ink-2"><span class="text-ink-3">›</span><span>Claude Code ran out. Pick up its work on the parser.</span></p>
        <p class="turn mt-4"><span>•</span><span>Called <span class="font-bold">turnscope.handoff</span>({'{}'})</span></p>
        <p class="turn out text-ink-2">
          <span class="text-ink-3">└</span><span
            ># Handoff: Fix the parser<br /><br />Claude Code session `claude-code:0f6e3f6a-713c-4d1e-9a6b-2b8c1d4e5f60` in
            `/work/app` on branch `main`, last active 08:01 (4m ago), 52 entries. Times are local; it's now Thu Oct 8 08:05.<br
            /><span class="text-ink-3">… +71 lines</span></span
          >
        </p>
        <p class="turn mt-4"><span>•</span><span>Claude Code fixed nested tables and wrote two of the four test files. The third fails on inline tables, so I'll start there.</span></p>
      </Terminal>
      <p class="mt-6 text-center text-[15px] text-ink-2 text-pretty">
        Get one with the <code class="font-mono text-[14px] text-ink">handoff</code> tool, the
        <code class="font-mono text-[14px] text-ink">continue</code> prompt or
        <code class="font-mono text-[14px] text-ink">turnscope handoff</code>.
      </p>
    </div>
  </section>

  <section class="column mt-36 sm:mt-48" aria-labelledby="status-line">
    {@render heading('status-line', 'A status line and a guard', '`turnscope statusline` prints your limits on one line. `turnscope guard` exits with an error when a limit runs low, so a hook can stop subagents before you run out.')}
    <div class="mx-auto mt-14 flex max-w-[760px] flex-col items-center">
      <div class="w-full overflow-hidden rounded-xl bg-[#1c1c1e] px-5 py-4 font-mono text-[13px] leading-[1.65] tracking-normal shadow-[0_0_0_0.5px_rgb(255_255_255/0.14)]" aria-label="A prompt with Turnscope's status line under it" role="img">
        <p class="border-y border-ink-4 py-1.5"><span class="text-ink-3">&gt;</span> <span class="cursor"></span></p>
        <p class="mt-1.5 text-ink-2">Claude Max · 5h 28%, out in 1h · weekly 60% · Opus weekly used up, back Sat 09:00</p>
      </div>
      <p class="mt-10 text-center text-[15px] text-ink-2 text-pretty">It picks up the account of the agent it’s running in.</p>
      <div class="mt-5 flex w-full flex-col items-center">
        <Tabs label="Where" options={lines} bind:value={line}>
          {#snippet panel(option)}
            <p class="mt-5 text-center text-[14px] text-ink-3">
              {option.caption} <code class="font-mono text-[13px] text-ink-2">{option.file}</code>:
            </p>
            <Command command={option.text} pre class="mt-3 w-[min(760px,calc(100vw-40px))] text-left" />
          {/snippet}
        </Tabs>
      </div>
    </div>
  </section>

  <section class="column mt-36 sm:mt-48" aria-labelledby="cli">
    {@render heading('cli', 'The command line', 'It ships with the app. Add `--json` to any command that prints data.')}
    <ul class="mx-auto mt-14 max-w-[760px] rounded-row bg-fill px-5 py-4 font-mono text-[13px] leading-[22px] tracking-normal">
      {#each commands as line (line.command)}
        <li class="flex flex-wrap gap-x-4 py-px max-sm:py-1">
          <span class="text-ink sm:w-[34ch]">{line.command}</span>
          <span class="text-ink-3"># {line.does}</span>
        </li>
      {/each}
    </ul>
    <p class="mt-6 text-center text-[14px]">
      <a class="text-ink-2 underline decoration-ink-4 underline-offset-4 transition-colors hover:text-ink" href="{site.repo}/blob/main/docs/cli.md">
        CLI docs
      </a>
    </p>
  </section>

  <section id="privacy" class="column mt-36 scroll-mt-8 sm:mt-48" aria-labelledby="privacy-title">
    {@render heading('privacy-title', 'Your history stays on your Mac', 'Turnscope only reads your agents’ history and logins. The one thing it changes is adding its MCP server to an agent, and only when you ask.')}
    {@render tiles(privacy, 'sm:grid-cols-3')}
  </section>

  <section class="column mt-36 sm:mt-48" aria-labelledby="supported">
    {@render heading('supported', 'Agents and providers', 'Turnscope works with these agents and reads limits from these providers.')}
    <div class="mt-12 flex flex-col gap-10">
      {@render names('Agents', agents)}
      {@render names('Providers', providers)}
    </div>
  </section>

  <section id="install" class="mt-36 scroll-mt-8 px-6 text-center sm:mt-48" aria-labelledby="get">
    <img src={appIcon} alt="" width="88" height="88" class="mx-auto size-[88px]" />
    <h2 id="get" class="mt-7 text-[30px] font-semibold tracking-[-0.03em]">Turnscope</h2>
    {@render download()}
    <ol class="mx-auto mt-14 max-w-[760px] text-left text-[16px] text-ink-2">
      <li class="step">Open the disk image and drag Turnscope to Applications.</li>
      <li class="step">Open Turnscope. It lives in your menu bar and checks for updates on its own.</li>
      <li class="step">Optional: put the command line on your <code class="font-mono text-[14px] text-ink">PATH</code>:</li>
    </ol>
    <Command command={link} class="mx-auto mt-4 max-w-[760px] text-left" />
  </section>
</main>

<Footer />

<!-- Section heading: title and a short description, with `code` in backticks. -->
{#snippet heading(id: string, title: string, said: string)}
  <div class="mx-auto max-w-[820px] text-center">
    <h2 {id} class="text-[30px] leading-[1.1] font-semibold tracking-[-0.035em] text-balance sm:text-[40px]">
      {title}
    </h2>
    <p class="mx-auto mt-5 max-w-[36em] text-[17px] leading-relaxed text-ink-2 text-pretty">
      {#each said.split('`') as part, index (index)}
        {#if index % 2}<code class="font-mono text-[15px] text-ink">{part}</code>{:else}{part}{/if}
      {/each}
    </p>
  </div>
{/snippet}

<!-- Names with their logos, as a centered row of pills. -->
{#snippet names(title: string, list: { name: string; plan?: string; logo: LogoName }[])}
  <div class="text-center">
    <h3 class="text-[13px] font-semibold tracking-normal text-ink-3 uppercase">{title}</h3>
    <ul class="mt-4 flex flex-wrap justify-center gap-2.5">
      {#each list as item (item.name)}
        <li class="inline-flex h-11 items-center gap-2.5 rounded-full bg-fill pr-5 pl-4 text-[16px]">
          <Logo name={item.logo} class="size-[18px] shrink-0" />
          {item.name}{#if item.plan}<span class="text-ink-3">{item.plan}</span>{/if}
        </li>
      {/each}
    </ul>
  </div>
{/snippet}

<!-- Tiles of an icon, a title and a sentence, the same size in a centered
     grid. A tool's title is set as code. -->
{#snippet tiles(list: Tile[], columns: string, code = false)}
  <ul class={['mx-auto mt-14 grid max-w-[920px] gap-3', columns]}>
    {#each list as item (item.title)}
      <li class="rounded-2xl bg-fill px-6 pt-5 pb-6 text-left">
        <div class="flex items-center gap-3">
          <Icon name={item.icon} class="size-[22px] shrink-0 text-ink-2" />
          <h3 class={code ? 'font-mono text-[15px] tracking-normal' : 'text-[17px] font-semibold tracking-[-0.015em]'}>
            {item.title}{#if item.tag}<span class="ml-2 font-sans text-[13px] text-ink-3">{item.tag}</span>{/if}
          </h3>
        </div>
        <p class="mt-3 text-[15px] leading-relaxed text-ink-2 text-pretty">{item.text}</p>
      </li>
    {/each}
  </ul>
{/snippet}

{#snippet download()}
  <div class="mt-10 flex justify-center"><a class="button" href="/download">Download for Mac</a></div>
  <p class="mt-4 text-[13px] text-ink-3">Free and open source. Requires {site.requires}, on Apple silicon or Intel.</p>
{/snippet}

<style>
  /* A numbered step, its number in a circle. */
  ol {
    counter-reset: step;
  }

  .step {
    counter-increment: step;
    position: relative;
    padding-left: 40px;
    margin-top: 14px;
  }

  .step::before {
    content: counter(step);
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    width: 26px;
    height: 26px;
    place-items: center;
    border-radius: 9999px;
    background: var(--color-fill);
    color: var(--color-ink);
    font-size: 13px;
    font-weight: 600;
  }

  /* The prompt's cursor. */
  .cursor {
    display: inline-block;
    width: 0.6em;
    height: 1.1em;
    vertical-align: text-bottom;
    background: var(--color-ink-3);
  }
</style>
