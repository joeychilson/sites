<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';
  import Logo, { type LogoName } from '#lib/components/Logo.svelte';
  import Glyph from '#lib/components/Glyph.svelte';

  // The menu bar panel (macos/Turnscope/Panel in the Turnscope repo), drawn
  // from the feed its README's screenshots are: Wednesday, 7 AM, and Claude
  // Max's five hours won't last. Its rows open as the app's do.
  type Limit = { name: string; left: number; atReset?: number; sentence: string; short?: boolean };

  const limits: Limit[] = [
    { name: '5 hours', left: 20, sentence: 'Runs out 9 AM, 1h before it resets.', short: true },
    { name: 'Week', left: 60, atReset: 43, sentence: 'About 43% left when it resets Sat 7 PM.' },
  ];

  const resting: {
    name: string;
    logo: LogoName;
    via: string;
    limit?: Limit;
    /** Its sign-in was refused: the agent to sign in again with. */
    agent?: string;
  }[] = [
    {
      name: 'ChatGPT Pro Lite',
      logo: 'openai',
      via: 'via Codex, OpenCode',
      limit: { name: 'Week', left: 66, atReset: 66, sentence: 'About 66% left when it resets Fri 2 PM.' },
    },
    { name: 'SuperGrok', logo: 'xai', via: 'via Grok, Pi', agent: 'Grok' },
  ];

  let open = $state(false);
  let restingOpen = $state(false);
  let chosen = $state<string>();

  // The app's spring, as near as a curve comes: room opens, then what's in it.
  const room = { duration: 280, easing: cubicOut };
</script>

<div class="w-[340px] max-w-full rounded-panel bg-panel pb-2.5 shadow-panel select-none">
  <div class="px-5 pt-[18px] pb-3.5">
    <p class="text-[20px] leading-tight font-semibold tracking-[-0.02em] text-amber">
      Claude Max runs out in 2h
    </p>
    <p class="mt-1 text-[13px] text-ink-2">At this pace, 1h before it resets.</p>
  </div>

  <div class="px-2">
    <button
      type="button"
      class={['row block w-full p-3 text-left', open && 'bg-fill']}
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      <span class="flex items-center gap-2">
        <Logo name="anthropic" class="size-4" />
        <span class="flex-1 text-[13px] font-semibold">Claude Max</span>
        <span class="text-[20px] font-semibold tracking-[-0.01em] text-amber tabular-nums">20%</span>
      </span>
      <span class="mt-2.5 block">{@render rows(limits)}</span>
      {#if open}
        <span class="block" transition:slide={room}>
          <span class="block pt-3.5 text-[11px] font-semibold text-ink-2">Used most of 5 hours</span>
          <span class="mt-2 flex items-baseline gap-2">
            <span class="min-w-0 flex-1">
              <span class="flex items-center gap-1.5 text-[12px]">
                Rethink the architecture
                <span class="size-[5px] rounded-full bg-ink"></span><span class="sr-only">Active now</span>
              </span>
              <span class="block text-[11px] text-ink-2">atlas · Claude Code</span>
            </span>
            <span class="text-[12px] text-ink-2 tabular-nums">12.5%</span>
          </span>
          <span class="mt-2.5 flex items-center gap-1.5 text-[12px] text-ink-2">
            <Glyph name="lightbulb" class="shrink-0" />
            Start fresh per task. Replies re-read 966K.
          </span>
        </span>
      {/if}
    </button>

    <button
      type="button"
      class="row mt-1.5 flex w-full items-center gap-2 px-3 py-2 text-left text-[12px]"
      aria-expanded={restingOpen}
      onclick={() => {
        restingOpen = !restingOpen;
        chosen = undefined;
      }}
    >
      <span class="flex-1 text-ink-2">2 not in use</span>
      {#if !restingOpen}
        <span class="text-ink-3 tabular-nums">ChatGPT Pro Lite 66%</span>
      {/if}
      {@render chevron(restingOpen)}
    </button>

    {#if restingOpen}
      <div transition:slide={room}>
        {#each resting as account (account.name)}
          {@const usable = !!account.limit}
          <button
            type="button"
            class={['row block w-full px-3 py-[7px] text-left', chosen === account.name && 'bg-fill']}
            aria-expanded={chosen === account.name}
            onclick={() => (chosen = chosen === account.name ? undefined : account.name)}
          >
            <span class="flex items-center gap-2">
              <Logo name={account.logo} class={usable ? 'size-3.5' : 'size-3.5 text-ink-2'} />
              <span class="min-w-0 flex-1">
                <span class={['block text-[12px]', !usable && 'text-ink-2']}>{account.name}</span>
                <span class="block text-[11px] text-ink-3">{account.via}</span>
              </span>
              {#if account.limit}
                {@render level(account.limit, 'w-11')}
                <span class="w-9 text-right text-[12px] font-medium tabular-nums">{account.limit.left}%</span>
              {:else}
                <span class="text-[12px] text-ink-2">Sign in again</span>
              {/if}
            </span>
            {#if chosen === account.name}
              <span class="block pt-2.5 text-[12px] text-ink-2" transition:slide={room}>
                {#if account.limit}
                  {@render rows([account.limit])}
                {:else}
                  Its sign-in was refused, so its limits can’t be read. Open {account.agent} to sign in again.
                {/if}
              </span>
            {/if}
          </button>
        {/each}
        <span class="flex items-center gap-2 px-3 py-[7px] text-[12px] text-ink-3">
          <span class="flex-1">1 hidden</span>
          {@render chevron(false)}
        </span>
      </div>
    {/if}
  </div>

  <div class="mt-1 flex items-center px-3.5 pt-1" aria-hidden="true">
    <span class="flex-1 text-[11px] text-ink-3">Updated now</span>
    <span class="grid size-7 place-items-center text-ink-2"><Glyph name="gearshape" /></span>
    <span class="grid size-7 place-items-center text-ink-2"><Glyph name="power" /></span>
  </div>
</div>

{#snippet rows(list: Limit[])}
  {#each list as limit (limit.name)}
    <span class="mt-2 block first:mt-0">
      <span class="flex items-center gap-1.5">
        <span class="w-[50px] text-[11px] font-medium text-ink-2">{limit.name}</span>
        {@render level(limit, 'flex-1')}
        <span class="w-[34px] text-right text-[11px] font-medium text-ink-2 tabular-nums">{limit.left}%</span>
      </span>
      <span class={['mt-1 block pl-14 text-[12px]', limit.short ? 'text-amber' : 'text-ink-2']}>
        {limit.sentence}
      </span>
    </span>
  {/each}
{/snippet}

<!-- A level, as a battery shows one: what's left, and within it, solid, what will still be left when it resets. -->
{#snippet level(limit: Limit, className: string)}
  <span class={['relative h-1.5 overflow-hidden rounded-full bg-track', className]}>
    <span
      class={['filling absolute inset-y-0 left-0 rounded-full', limit.short ? 'bg-amber' : 'bg-level']}
      style:width="max(6px, {limit.left}%)"
    ></span>
    {#if limit.atReset}
      <span class="filling absolute inset-y-0 left-0 rounded-full bg-level-2" style:width="{limit.atReset}%"></span>
    {/if}
  </span>
{/snippet}

{#snippet chevron(down: boolean)}
  <span class={['flex text-ink-3 transition-transform duration-200', down && 'rotate-90']}>
    <Glyph name="chevron" />
  </span>
{/snippet}

<style>
  .row {
    cursor: default;
    border-radius: var(--radius-row);
    transition: background-color 120ms;
  }

  .row:hover {
    background: var(--color-fill);
  }

  /* Levels fill from empty as the panel opens, as the app's do. */
  .filling {
    transform-origin: left;
    animation: fill 600ms var(--ease-spring) 50ms both;
  }

  @keyframes fill {
    from {
      transform: scaleX(0);
    }
  }
</style>
