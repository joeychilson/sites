<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';
  import appIconDark from '#lib/assets/app-icon-dark.webp';
  import appIconLight from '#lib/assets/app-icon-light.webp';
  import Agents from '#lib/components/Agents.svelte';
  import Command from '#lib/components/Command.svelte';
  import Desktop from '#lib/components/Desktop.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import Glyph from '#lib/components/Glyph.svelte';
  import Item from '#lib/components/Item.svelte';
  import type { Standing } from '#lib/components/Level.svelte';
  import MenuBar from '#lib/components/MenuBar.svelte';
  import Panel from '#lib/components/Panel.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import Tabs from '#lib/components/Tabs.svelte';
  import Terminal from '#lib/components/Terminal.svelte';
  import { executable, site } from '#lib/site.js';

  let open = $state(true);

  const states = [
    { figure: '62%', state: 'lasts', clock: 'Mon 10:12 AM', name: 'Gray', text: 'It lasts until it resets. The number is what’s left.' },
    {
      figure: '1h 40m',
      state: 'short',
      clock: 'Wed 7:20 AM',
      name: 'Amber',
      text: 'It runs out before it resets. In the last three hours, it counts down.',
    },
    { figure: 'Back 5:40 AM', state: 'out', clock: 'Fri 1:05 AM', name: 'Red', text: 'It’s used up. The time is when it’s back.' },
  ] as const;

  // As Words.note and Words.recap in the app word them, newest first, on
  // the Wednesday the panel is drawn: ChatGPT Pro Lite's week is the one that
  // resets Saturdays at 2 PM.
  const notes = [
    { title: 'Claude Max runs out 9 AM', body: 'At this pace, before the 5 hours resets', when: 'now' },
    { title: 'Last week', body: 'Claude Max used 82%, most on atlas', when: 'Mon' },
    { title: 'ChatGPT Pro Lite is back', body: 'The week limit reset', when: 'Sat' },
  ];

  const tools = [
    { name: 'check_limits', asks: 'How much is left, and will it last?' },
    { name: 'explain_limit', asks: 'What used up a limit, and why?' },
    { name: 'find_sessions', asks: 'Which sessions match a folder, agent or search?' },
    { name: 'get_session', asks: 'What was a session doing, and where did it stop?' },
    { name: 'read_session', asks: 'What exactly was said and done?' },
    { name: 'get_usage', asks: 'How many tokens, and what did they cost?' },
  ];

  const clients = [
    {
      value: 'claude',
      label: 'Claude Code',
      command: `claude mcp add --scope user turnscope -- ${executable} mcp`,
    },
    { value: 'codex', label: 'Codex', command: `codex mcp add turnscope -- ${executable} mcp` },
    {
      value: 'opencode',
      label: 'OpenCode',
      command: `opencode mcp add --global turnscope -- ${executable} mcp`,
    },
    {
      value: 'grok',
      label: 'Grok Build',
      command: `grok mcp add --scope user turnscope ${executable} mcp`,
    },
    {
      value: 'other',
      label: 'Other',
      command: `{\n  "mcpServers": {\n    "turnscope": {\n      "command": "${executable}",\n      "args": ["mcp"]\n    }\n  }\n}`,
    },
  ] as const;

  let client = $state<(typeof clients)[number]['value']>('claude');

  // What both terminals are asked, and what the hook tells the agent.
  const prompt = 'Fix the parser, and use subagents to write its tests.';
  const say = 'Less than half the week is left. Do this yourself.';

  const facts = [
    { label: 'Price', value: 'Free' },
    { label: 'Sign-up', value: 'None' },
    { label: 'Telemetry', value: 'None' },
    { label: 'Your agents’ files', value: 'Read only' },
  ];
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

<MenuBar bind:open desktop />

<main id="main">
  <!-- Above the sections after it, so the panel, opened, lies over them as it would over a window. -->
  <section
    class="column relative isolate z-10 grid gap-12 pb-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16 lg:pb-20"
  >
    <!-- The desktop the menu bar and the panel lie over, under the header too, across the page. -->
    <div class="absolute -top-8 bottom-0 left-1/2 -z-10 w-screen -translate-x-1/2" aria-hidden="true">
      <Desktop class="size-full" fade />
    </div>
    <div class="min-w-0 pt-16 sm:pt-24 lg:pt-32">
      <h1
        class="max-w-[10em] text-[44px] leading-[1.02] font-bold tracking-[-0.045em] text-balance sm:text-[60px]"
      >
        Know if your limits will last
      </h1>
      <p class="lede mt-6 max-w-[28em] sm:text-[20px]">
        Turnscope shows what’s left of your subscription’s limits, and whether it’ll last at the pace
        you’re going. It’s a menu bar app for Claude Code, Codex, OpenCode, Pi and Grok Build.
      </p>
      {@render install()}
    </div>
    <!--
      Hanging from its item in the menu bar, as it opens on a Mac. On a wide
      screen it floats, so a row opened in it lies over the page rather than
      pushing it down; on a narrow one, between the words, it takes its room.
    -->
    <div class="flex min-h-[320px] justify-center pt-1.5 lg:relative lg:min-h-[340px] lg:justify-end">
      {#if open}
        <div
          id="panel"
          class="origin-top lg:absolute lg:top-1.5 lg:right-0"
          transition:scale={{ start: 0.97, duration: 180, easing: cubicOut }}
        >
          <Panel />
        </div>
      {/if}
    </div>
  </section>

  <section class="column pt-12 sm:pt-20" aria-labelledby="calm">
    <h2 id="calm" class="title">Gray until it matters</h2>
    <p class="lede mt-4 max-w-[32em]">
      The number in the menu bar is what’s left of your tightest limit. It stays gray while that
      will last, and turns amber or red when it won’t.
    </p>
    <ul class="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-5">
      {#each states as item (item.state)}
        <li>
          <!-- The top of a screen: the item, beside the system's own and the clock. -->
          <div aria-hidden="true">
            <Desktop class="h-[84px] rounded-[14px] shadow-note">
              {@render bar(item.clock, item)}
            </Desktop>
          </div>
          <p class="mt-4 text-[15px] text-ink-2 text-pretty">
            <span class="font-semibold text-ink">{item.name}.</span>
            {item.text}
          </p>
        </li>
      {/each}
    </ul>
  </section>

  <section
    class="column grid items-center gap-12 pt-28 sm:pt-40 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16"
    aria-labelledby="told"
  >
    <div class="min-w-0">
      <h2 id="told" class="title">Warned before you run out</h2>
      <p class="lede mt-4 max-w-[30em]">
        Turnscope sends a notification when a limit won’t last at your pace, when it’s used up, and
        when it’s back. You can also get a recap of your week every Monday morning.
      </p>
    </div>
    <!-- The top right of a screen, where macOS shows them, under the menu bar. -->
    <Desktop class="rounded-tile pb-4 shadow-note">
      {@render bar('Wed 7:00 AM')}
      <ul class="mac mt-1 flex flex-col gap-2 px-3">
        {#each notes as note (note.title)}
          <li class="flex items-center gap-2.5 rounded-[18px] glass py-2.5 pr-3.5 pl-2.5 shadow-banner">
            <picture class="shrink-0">
              <source srcset={appIconDark} media="(prefers-color-scheme: dark)" />
              <img src={appIconLight} alt="" width="38" height="38" class="size-[38px]" />
            </picture>
            <span class="min-w-0 flex-1 text-[13px] leading-4">
              <span class="flex items-baseline gap-2">
                <span class="flex-1 truncate font-semibold">{note.title}</span>
                <span class="text-[12px] text-label-2">{note.when}</span>
              </span>
              <span class="mt-0.5 block truncate">{note.body}</span>
            </span>
          </li>
        {/each}
      </ul>
    </Desktop>
  </section>

  <section class="column pt-28 sm:pt-40" aria-labelledby="agents">
    <div class="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-16">
      <div class="min-w-0">
        <h2 id="agents" class="title">Your agents can pace themselves</h2>
        <p class="lede mt-4 max-w-[30em]">
          Turnscope is also an MCP server, so an agent can check its own limits before starting
          something big, and take a cheaper route if they won’t last.
        </p>
      </div>
      <!-- An agent's turn, as Claude Code shows it, in the words check_limits answers with. -->
      <Terminal
        title="atlas — claude"
        label="Asked to use subagents for the tests, Claude Code checks its week with Turnscope, learns it runs out Thursday night, almost two days before it resets, and writes the tests itself."
      >
        <p class="turn text-ink-2"><span class="text-ink-3">&gt;</span><span>{prompt}</span></p>
        <p class="turn mt-4"><span>●</span><span><span class="font-bold">turnscope - check_limits</span> (MCP)(limit: "week")</span></p>
        <p class="turn out pl-[2ch]"><span class="text-ink-3">⎿</span><span class="text-ink-2">You’re using Claude Max, in Claude Code.<br /><span class="text-amber-ink">Week: 31% left. At this pace it runs out around Thu 9:50 PM, 1d 21h before it resets at Sat 7:00 PM.</span></span></p>
        <p class="turn mt-4"><span>●</span><span>The week runs out Thursday night at this pace, and subagents would make it sooner. I’ll write the tests myself, one file at a time.</span></p>
      </Terminal>
    </div>

    <dl class="mt-16 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each tools as tool (tool.name)}
        <div>
          <dt class="font-mono text-[13px] tracking-normal text-ink-3">{tool.name}</dt>
          <dd class="mt-1 text-[17px] font-medium tracking-[-0.015em]">{tool.asks}</dd>
        </div>
      {/each}
    </dl>

    <div class="mt-20 grid gap-14 lg:grid-cols-2 lg:gap-8">
      <div class="min-w-0">
        <!-- Settings, open on its Agents tab, over the desktop. -->
        <Desktop class="flex items-center justify-center rounded-tile px-4 py-8 shadow-note lg:h-[340px]">
          <Agents />
        </Desktop>
        <h3 class="mt-8 text-[17px] font-semibold tracking-[-0.015em]">Connect an agent</h3>
        <p class="mt-1 text-ink-2">One click in Settings, or run the agent’s own command:</p>
        <div class="mt-5">
          <Tabs label="Agent" options={clients} bind:value={client}>
            {#snippet panel(item)}
              <Command command={item.command} class="mt-3" />
            {/snippet}
          </Tabs>
        </div>
      </div>
      <div class="min-w-0">
        <!-- The same ask, met by the hook below: Claude Code's subagent refused, and why. -->
        <Terminal
          class="lg:h-[340px]"
          title="atlas — claude"
          label="Asked to use subagents for the tests, Claude Code starts one, and Turnscope's hook refuses it: less than half the week is left. Claude Code writes the tests itself."
        >
          <p class="turn text-ink-2"><span class="text-ink-3">&gt;</span><span>{prompt}</span></p>
          <p class="turn mt-4"><span>●</span><span><span class="font-bold">Agent</span>(Write the parser’s tests)</span></p>
          <p class="turn out pl-[2ch]"><span class="text-ink-3">⎿</span><span class="text-ink-2">PreToolUse:Agent hook error: <span class="text-amber-ink">{say} (Claude Max, week: 31% left, under 50%. It resets Sat 7:00 PM.)</span></span></p>
          <p class="turn mt-4"><span>●</span><span>Less than half the week is left, so I’ll write the tests myself.</span></p>
        </Terminal>
        <h3 class="mt-8 text-[17px] font-semibold tracking-[-0.015em]">Or make it a rule</h3>
        <p class="mt-1 text-ink-2">
          Add this to Claude Code as a PreToolUse hook on the Agent tool. It blocks subagents once
          less than half the week is left, and tells the agent why:
        </p>
        <Command class="mt-5" command="{executable} guard --limit week --below 50 --say '{say}'" />
      </div>
    </div>
  </section>

  <section class="column pt-28 sm:pt-40" aria-labelledby="privacy">
    <h2 id="privacy" class="title">Your history stays on your Mac</h2>
    <p class="lede mt-4 max-w-[32em]">
      Turnscope reads the history files your agents already keep, and never changes them. It only
      connects to your providers for your limits, models.dev for prices, and GitHub for updates.
    </p>
    <dl class="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {#each facts as fact (fact.label)}
        <div class="rounded-row bg-fill px-4 py-3.5">
          <dt class="text-[14px] text-ink-2">{fact.label}</dt>
          <dd class="mt-0.5 text-[22px] font-bold tracking-[-0.025em]">{fact.value}</dd>
        </div>
      {/each}
    </dl>
  </section>

  <section class="column pt-28 text-center sm:pt-40" aria-labelledby="get">
    <picture>
      <source srcset={appIconDark} media="(prefers-color-scheme: dark)" />
      <img src={appIconLight} alt="" width="96" height="96" class="mx-auto size-24" />
    </picture>
    <h2 id="get" class="title mt-6">Get Turnscope</h2>
    {@render install(true)}
  </section>
</main>

<Footer />

<!-- A slice of the menu bar, at the top right of a screen: Turnscope's item, when shown, the system's own, and the clock. -->
{#snippet bar(clock: string, item?: { figure: string; state: Standing })}
  <div class="mac flex h-8 items-center justify-end px-1.5 text-[13px] font-medium" aria-hidden="true">
    {#if item}
      <span class="px-2"><Item figure={item.figure} state={item.state} /></span>
    {/if}
    <span class="px-1.5"><Glyph name="wifi" /></span>
    <span class="px-1.5"><Glyph name="controls" /></span>
    <span class="px-2 tabular-nums">{clock}</span>
  </div>
{/snippet}

{#snippet install(center = false)}
  <div class={['mt-8 flex flex-col gap-3', center ? 'items-center' : 'items-start']}>
    <a class="button" href="/download">
      <svg class="-ml-1 size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path
          d="M11.2 8.4c0-1.6 1.3-2.4 1.4-2.4-.8-1.1-1.9-1.3-2.3-1.3-1-.1-1.9.6-2.4.6-.5 0-1.3-.6-2.1-.6-1.1 0-2.1.6-2.6 1.6-1.1 1.9-.3 4.8.8 6.4.5.8 1.2 1.6 2 1.6s1.1-.5 2.1-.5 1.3.5 2.1.5c.9 0 1.4-.8 1.9-1.6.6-.9.9-1.8.9-1.8s-1.8-.7-1.8-2.5ZM9.6 3.6c.4-.5.7-1.2.6-1.9-.6 0-1.4.4-1.8.9-.4.4-.7 1.1-.6 1.8.7.1 1.4-.3 1.8-.8Z"
        />
      </svg>
      Download for Mac
    </a>
    <p class="text-[13px] text-ink-3">Free and open source. Requires {site.requires}.</p>
  </div>
{/snippet}

<style>
  /* A line of the agent's turn: its mark, and what's said, hung after it. */
  .turn {
    display: grid;
    grid-template-columns: 2ch minmax(0, 1fr);
  }

  /* What a call answered, under it, set off as Claude Code sets it. */
  .turn.out {
    grid-template-columns: 3ch minmax(0, 1fr);
  }
</style>
