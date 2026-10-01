<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';
  import appIconDark from '#lib/assets/app-icon-dark.webp';
  import appIconLight from '#lib/assets/app-icon-light.webp';
  import Command from '#lib/components/Command.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import Item from '#lib/components/Item.svelte';
  import MenuBar from '#lib/components/MenuBar.svelte';
  import Panel from '#lib/components/Panel.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import Tabs from '#lib/components/Tabs.svelte';
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

  // As Words.note in the app words them.
  const notes = [
    { title: 'Claude Max runs out 9 AM', body: 'At this pace, before the 5 hours resets', when: 'now' },
    { title: 'ChatGPT Pro Lite is back', body: 'Week limit reset', when: '2h ago' },
    { title: 'Last week', body: 'Claude Max used 82%, most on atlas', when: 'Mon' },
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

<MenuBar bind:open />

<main id="main">
  <section class="column grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
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
    <!-- Hanging from its item in the menu bar, as it opens on a Mac. -->
    <div class="flex min-h-[420px] justify-center pt-1.5 lg:justify-end">
      {#if open}
        <div
          id="panel"
          class="origin-top"
          transition:scale={{ start: 0.97, duration: 180, easing: cubicOut }}
        >
          <Panel />
        </div>
      {/if}
    </div>
  </section>

  <section class="column pt-28 sm:pt-40" aria-labelledby="calm">
    <h2 id="calm" class="title">Gray until it matters</h2>
    <p class="lede mt-4 max-w-[32em]">
      The number in the menu bar is what’s left of your tightest limit. It stays gray while that
      will last, and turns amber or red when it won’t.
    </p>
    <ul class="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-5">
      {#each states as item (item.state)}
        <li>
          <!-- A slice of the menu bar: the item, and the clock beside it. -->
          <div
            class="flex h-10 items-center justify-end gap-4 rounded-row bg-panel px-4 text-[13px] shadow-note"
            aria-hidden="true"
          >
            <Item figure={item.figure} state={item.state} />
            <span class="font-medium tabular-nums">{item.clock}</span>
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
    <ul class="flex flex-col gap-2.5">
      {#each notes as note, index (note.title)}
        <li
          class="flex items-center gap-3 rounded-note bg-panel py-3 pr-4 pl-3 shadow-note"
          style:opacity={1 - index * 0.12}
        >
          <picture class="shrink-0">
            <source srcset={appIconDark} media="(prefers-color-scheme: dark)" />
            <img src={appIconLight} alt="" width="36" height="36" class="size-9" />
          </picture>
          <span class="min-w-0 flex-1 text-[13px] leading-snug">
            <span class="flex items-baseline gap-2">
              <span class="flex-1 truncate font-semibold">{note.title}</span>
              <span class="text-[12px] text-ink-3">{note.when}</span>
            </span>
            <span class="block truncate text-ink-2">{note.body}</span>
          </span>
        </li>
      {/each}
    </ul>
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
      <!-- An agent's turn, as a terminal shows it. -->
      <div
        class="min-w-0 rounded-tile bg-panel p-5 font-mono text-[13px] leading-[1.6] tracking-normal shadow-note sm:p-6"
        role="img"
        aria-label="Asked to use subagents for the tests, an agent checks its limits with Turnscope, learns the week runs out two days early, and writes the tests itself."
      >
        <p class="flex gap-2.5 text-ink-2"><span class="text-ink-3">›</span>Fix the parser, and use subagents to write its tests.</p>
        <p class="mt-4 flex gap-2.5"><span>●</span><span><span class="font-semibold">turnscope</span> <span class="text-ink-2">check_limits</span></span></p>
        <p class="flex gap-2.5 pl-1 text-amber-ink">
          <span class="text-ink-3">└</span>Your week runs out Thu around 10 PM at this pace, 2 days before it resets.
        </p>
        <p class="mt-4 flex gap-2.5"><span>●</span>Subagents would run the week out sooner, so I’ll write the tests myself, one file at a time.</p>
      </div>
    </div>

    <dl class="mt-16 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each tools as tool (tool.name)}
        <div>
          <dt class="font-mono text-[13px] tracking-normal text-ink-3">{tool.name}</dt>
          <dd class="mt-1 text-[17px] font-medium tracking-[-0.015em]">{tool.asks}</dd>
        </div>
      {/each}
    </dl>

    <div class="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div class="min-w-0">
        <h3 class="text-[17px] font-semibold tracking-[-0.015em]">Connect an agent</h3>
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
        <h3 class="text-[17px] font-semibold tracking-[-0.015em]">Or make it a rule</h3>
        <p class="mt-1 text-ink-2">
          Add this as a Claude Code hook to block subagents once less than half the week is left,
          and tell the agent why:
        </p>
        <Command
          class="mt-5"
          command="turnscope guard --limit week --below 50 --say 'Less than half the week is left. Do this yourself.'"
        />
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
