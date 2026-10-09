<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { fade, slide, type TransitionConfig } from 'svelte/transition';
  import Bar, { type Standing } from '#lib/components/Bar.svelte';
  import Glyph from '#lib/components/Glyph.svelte';
  import Logo, { type LogoName } from '#lib/components/Logo.svelte';

  // The app's panel (macos/Turnscope/Panel in the Turnscope repo) in HTML,
  // showing contract/status.notification.json at its time, Thu 7:00 AM, in
  // the words the app's `Words` gives it. As in the app, one account opens
  // at a time. Claude Max starts open, as `--open account` draws it, with
  // the session contract/limit.breakdown.result.json says used it most.

  /** A limit's line: its name and times, what's left, and a bar. */
  type Line = {
    name: string;
    /** When it runs out, in its standing's color. */
    ahead?: string;
    /** When it resets, or when it's back if it's used up. */
    window?: string;
    left: string;
    /** After what's left of money: "of $30". */
    size?: string;
    level: number;
    standing: Standing;
  };

  type Account = {
    id: string;
    title: string;
    logo: LogoName;
    /** Under the name while the limit lines are hidden: the deciding limit and what's next. */
    status: string;
    /** The deciding limit's standing, which colors the status and figure. */
    standing: Standing;
    /** On the right while the limit lines are hidden: what's left of the deciding limit. */
    figure: string;
    /** After the figure, quieter: the size of a limit of money. */
    size?: string;
    lines: Line[];
    /** Under the lines when open: what the limits can't say. */
    note?: string;
  };

  const claude: Account = {
    id: 'claude',
    title: 'Claude Max',
    logo: 'anthropic',
    status: '5 hours runs out in 1h',
    standing: 'short',
    figure: '28%',
    lines: [
      { name: '5 hours', ahead: 'Runs out in 1h', window: 'Resets in 3h', left: '28%', level: 28, standing: 'short' },
      { name: 'Weekly', window: 'Resets in 3h', left: '60%', level: 60, standing: 'lasts' },
      { name: 'Opus weekly', window: 'Back Sat 9 AM', left: '0%', level: 0, standing: 'out' },
    ],
  };

  const recent: Account[] = [
    {
      id: 'chatgpt',
      title: 'ChatGPT Pro',
      logo: 'openai',
      status: 'Monthly resets Oct 22',
      standing: 'lasts',
      figure: '97%',
      lines: [
        { name: 'Weekly', window: 'Reset 6:30 AM', left: '100%', level: 100, standing: 'lasts' },
        { name: 'Monthly', window: 'Resets Oct 22', left: '97%', level: 97, standing: 'lasts' },
      ],
      note: 'As read yesterday 9 PM; no agent here is signed in to it now.',
    },
    {
      id: 'openrouter',
      title: 'OpenRouter API key',
      logo: 'openrouter',
      status: 'Pi’s key',
      standing: 'lasts',
      figure: '$8.70',
      size: 'of $30',
      lines: [
        { name: 'Pi’s key', left: '$8.70', size: 'of $30', level: 29, standing: 'lasts' },
        { name: '5 hours', window: 'Resets 11 AM', left: '100%', level: 100, standing: 'lasts' },
        { name: 'Daily', window: 'Resets in 3h', left: '99%', level: 99, standing: 'lasts' },
      ],
      note: 'As read 6:50 AM; it couldn’t be read since.',
    },
  ];

  const unused: Account[] = [
    {
      id: 'opencode-go',
      title: 'OpenCode Go',
      logo: 'opencode-go',
      status: 'Sign in again',
      standing: 'lasts',
      figure: '—',
      lines: [],
      note: 'Open Claude Code to sign in again.',
    },
    {
      id: 'anthropic-api',
      title: 'Anthropic API key',
      logo: 'anthropic',
      status: "Couldn't be read yet",
      standing: 'lasts',
      figure: '—',
      lines: [],
      note: "It couldn't be read yet.",
    },
  ];

  let open = $state<string | undefined>(claude.id);
  let unusedOpen = $state(false);
  let hiddenShown = $state(false);

  // Close to the app's spring: space opens first, then content fades in.
  const room = { duration: 340, easing: cubicOut };
  const appear = { delay: 150, duration: 160 };

  /** Collapses or expands a line while fading it, so the logo beside it moves smoothly. */
  function fold(node: Element): TransitionConfig {
    const closing = slide(node, room);
    return { ...closing, css: (t, u) => `${closing.css?.(t, u) ?? ''}opacity: ${t};` };
  }

  /** Text color for a standing (Standing.ink in Style.swift). */
  const ink = (standing: Standing, lasting: string) =>
    standing === 'short' ? 'text-amber' : standing === 'out' ? 'text-red' : lasting;
</script>

<div class="mac glass w-[340px] max-w-full rounded-[14px] shadow-glass select-none">
  <div class="px-5 pt-[19.5px] pb-3.5">
    <p class="text-[20px] leading-6 font-semibold text-amber">Claude Max runs out in&nbsp;1h</p>
    <p class="mt-1 text-[13px] leading-4 text-label-2">Back in 3h.</p>
  </div>

  <div class="px-2">
    {@render row(claude, true)}
  </div>

  <div class="flex flex-col gap-1 px-2 pt-3">
    <p class="px-3 pb-1 text-[11px] leading-[14px] font-semibold text-label-2">Used this week</p>
    {#each recent as account (account.id)}
      {@render row(account)}
    {/each}
  </div>

  <div class="flex flex-col gap-1 px-2 pt-1">
    {@render foldLine(`${unused.length} more accounts`, unusedOpen, () => {
      unusedOpen = !unusedOpen;
      if (!unusedOpen) {
        if (unused.some((account) => account.id === open)) open = undefined;
        hiddenShown = false;
      }
    })}

    {#if unusedOpen}
      <div transition:slide={room}>
        <div class="flex flex-col gap-1" in:fade={appear}>
          {#each unused as account (account.id)}
            {@render row(account)}
          {/each}
          {@render foldLine('1 hidden', hiddenShown, () => (hiddenShown = !hiddenShown))}
          {#if hiddenShown}
            <div transition:slide={room}>
              <span class="flex items-center gap-2 px-3 py-[7px]" in:fade={appear}>
                <Logo name="xai" class="size-4 shrink-0 text-label-3" />
                <span class="min-w-0 flex-1">
                  <span class="block text-[13px] leading-4 text-label-2">SuperGrok</span>
                  <span class="mt-px block text-[11px] leading-[14px] text-label-3">via Claude Code</span>
                </span>
                <span
                  class="flex h-[22px] items-center rounded-full bg-label-4 px-2.5 text-[12px] font-medium"
                  aria-hidden="true">Show</span
                >
              </span>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  <div class="flex items-center justify-end gap-0.5 px-3.5 py-2.5" aria-hidden="true">
    <span class="icon"><Glyph name="gearshape" /></span>
    <span class="icon"><Glyph name="power" /></span>
  </div>
</div>

<!--
  An account's row. Closed: the deciding limit and what's next under the
  name, what's left on the right. Open: a line per limit, then what they
  can't say, and for the account in use, the sessions that used it most. A
  row with nothing to show doesn't open.
-->
{#snippet row(account: Account, inUse = false)}
  {@const style = 'row block w-full rounded-[10px] px-3 py-[7px] text-left'}
  {#if account.lines.length > 0 || account.note}
    {@const on = open === account.id}
    <button
      type="button"
      class={[style, on && 'on']}
      aria-expanded={on}
      onclick={() => (open = on ? undefined : account.id)}
    >
      {@render inside(account, on, inUse)}
    </button>
  {:else}
    <div class={style}>{@render inside(account, false, inUse)}</div>
  {/if}
{/snippet}

{#snippet inside(account: Account, on: boolean, inUse: boolean)}
  {@const lines = on && account.lines.length > 0}
  <!-- A row that ends in a bar adds 3px under it, the room text keeps above its letters, so it's as deep below as above. -->
  {@const endsInBar = lines && !account.note && !inUse}
  <span class="flex items-center gap-2">
    <Logo name={account.logo} class="size-4 shrink-0" />
    <span class="min-w-0 flex-1">
      <span class="block truncate text-[13px] leading-4">{account.title}</span>
      {#if !lines}
        <span
          class={['mt-px block truncate text-[11px] leading-[14px]', ink(account.standing, 'text-label-2')]}
          transition:fold
        >
          {account.status}
        </span>
      {/if}
    </span>
    {#if !lines}
      <span
        class="pl-2 text-[13px] leading-4 whitespace-nowrap tabular-nums"
        transition:fade={{ duration: 200, easing: cubicOut }}
      >
        <span class={['font-semibold', ink(account.standing, '')]}>{account.figure}</span>
        {#if account.size}<span class="text-label-2">{account.size}</span>{/if}
      </span>
    {/if}
  </span>
  {#if lines || (on && account.note)}
    <span class="block" transition:slide={room}>
      <span class={['flex flex-col gap-2.5 pt-2.5', endsInBar && 'pb-[3px]']} in:fade={appear}>
        {#if lines}
          {#each account.lines as line (line.name)}
            {@render limit(line)}
          {/each}
        {/if}
        {#if account.note}
          <span class="block text-[12px] leading-[15px] text-label-2">{account.note}</span>
        {/if}
        {#if inUse}
          {@render usedMost()}
        {/if}
      </span>
    </span>
  {/if}
{/snippet}

<!-- A limit's line: its name and times in gray, but for a time that needs you; what's left; its bar. -->
{#snippet limit(line: Line)}
  <span class="block">
    <span class="flex items-baseline gap-2 text-[11px] leading-[14px]">
      <span class="min-w-0 flex-1 truncate text-label-2">
        <span class="font-medium">{line.name}</span>
        {#if line.ahead}{' · '}<span class={ink(line.standing, '')}>{line.ahead}</span>{/if}
        {#if line.window}{' · '}<span class={line.standing === 'out' ? 'text-red' : ''}>{line.window}</span>{/if}
      </span>
      <span class="whitespace-nowrap tabular-nums">
        <span class={['font-medium', ink(line.standing, '')]}>{line.left}</span>
        {#if line.size}<span class="text-label-2">{line.size}</span>{/if}
      </span>
    </span>
    <Bar left={line.level} standing={line.standing} class="mt-[5px]" />
  </span>
{/snippet}

<!-- The sessions that used the deciding limit most, each with its share and project under its title. -->
{#snippet usedMost()}
  <span class="flex flex-col gap-2">
    <span class="block text-[11px] leading-[14px] font-semibold text-label-2">Used most of 5 hours</span>
    <span class="block">
      <span class="flex items-center gap-[5px] text-[12px] leading-[15px]">
        Fix the parser
        <span class="size-1.5 rounded-full bg-active" title="Active now"></span><span class="sr-only">Active now</span>
      </span>
      <span class="mt-px block text-[11px] leading-[14px] text-label-2 tabular-nums">32% · app</span>
    </span>
  </span>
{/snippet}

<!-- A line that folds rows away: what it holds, and a chevron. -->
{#snippet foldLine(text: string, down: boolean, toggle: () => void)}
  <button
    type="button"
    class="row flex w-full items-center gap-2 rounded-[10px] px-3 py-[7px] text-left text-[12px] leading-[15px]"
    aria-expanded={down}
    onclick={toggle}
  >
    <span class="flex-1 text-label-2">{text}</span>
    <span class={['flex text-label-3 transition-transform duration-200', down && 'rotate-90']}>
      <Glyph name="chevron" />
    </span>
  </button>
{/snippet}

<style>
  .row {
    cursor: default;
    transition: background-color 120ms;
  }

  .row:hover,
  .row.on {
    background: var(--color-row);
  }

  /* A toolbar button, as the app's IconButton: it fills while pointed at. */
  .icon {
    display: grid;
    width: 28px;
    height: 28px;
    place-items: center;
    border-radius: 7px;
    color: var(--color-label-2);
    transition:
      background-color 100ms,
      color 100ms;
  }

  .icon:hover {
    background: var(--color-label-4);
    color: var(--color-label);
  }
</style>
