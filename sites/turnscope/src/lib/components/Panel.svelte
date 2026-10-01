<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { fade, slide } from 'svelte/transition';
  import Glyph from '#lib/components/Glyph.svelte';
  import Level, { type Standing } from '#lib/components/Level.svelte';
  import Logo, { type LogoName } from '#lib/components/Logo.svelte';

  // The menu bar panel (macos/Turnscope/Panel in the Turnscope repo), drawn
  // from the feed the README's screenshots are (contract/feed.json):
  // Wednesday, 7 AM, and Claude Max's five hours won't last. Its words are
  // the ones Words.swift gives that feed, and its rows open as the app's do.
  type Limit = {
    name: string;
    left: number;
    atReset?: number;
    reserve?: number;
    standing: Standing;
    sentence: string;
    /** How it stands against an even pace. The headline already says what the five hours keep to. */
    pace?: string;
  };

  const limits: Limit[] = [
    {
      name: '5 hours',
      left: 20,
      reserve: -40,
      standing: 'short',
      sentence: 'Runs out 9 AM, 1h before it resets.',
    },
    {
      name: 'Week',
      left: 60,
      atReset: 43,
      reserve: 10,
      standing: 'lasts',
      sentence: 'About 43% left when it resets Sat 7 PM.',
      pace: '10% in reserve',
    },
  ];

  const resting: {
    name: string;
    logo: LogoName;
    via: string;
    limit?: Limit;
    /** Why its limits can't be read. */
    trouble?: string;
  }[] = [
    {
      name: 'ChatGPT Pro Lite',
      logo: 'openai',
      via: 'via Codex, OpenCode',
      limit: {
        name: 'Week',
        left: 66,
        atReset: 66,
        reserve: 19,
        standing: 'lasts',
        sentence: 'About 66% left when it resets Sat 2 PM.',
        pace: '19% in reserve',
      },
    },
    {
      name: 'SuperGrok',
      logo: 'xai',
      via: 'via Grok, Pi',
      trouble: 'Its sign-in was refused. Open Grok to sign in again.',
    },
  ];

  let open = $state(false);
  let restingOpen = $state(false);
  let chosen = $state<string>();
  let showHidden = $state(false);

  // The app's spring, as near as a curve comes: room opens, then what's in
  // it fades in, so nothing moving passes over text.
  const room = { duration: 300, easing: cubicOut };
  const appear = { delay: 150, duration: 160 };
</script>

<div class="mac glass w-[340px] max-w-full rounded-[14px] shadow-glass select-none">
  <div class="px-5 pt-[18px] pb-3.5">
    <p class="text-[20px] leading-6 font-semibold text-amber">Claude Max runs out in 2h</p>
    <p class="mt-1 text-[13px] leading-4 text-label-2">Stay under 6% an hour to last.</p>
  </div>

  <div class="px-2">
    <button
      type="button"
      class={['row block w-full rounded-xl p-3 text-left', open && 'on']}
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      <span class="flex items-center gap-2">
        <Logo name="anthropic" class="size-4" />
        <span class="flex-1 text-[13px] leading-4 font-semibold">Claude Max</span>
        <span class="font-rounded text-[20px] leading-6 font-semibold text-amber tabular-nums">
          20%
        </span>
      </span>
      <span class="mt-2.5 block">{@render rows(limits)}</span>
      {#if open}
        <span class="block" transition:slide={room}>
          <span class="flex flex-col gap-2 pt-2.5" in:fade={appear}>
            <span class="block pt-1 text-[11px] leading-[13px] font-semibold text-label-2">
              Used most of 5 hours
            </span>
            <span class="flex items-start gap-2">
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-[5px] text-[12px] leading-[15px]">
                  Rethink the architecture
                  <span class="size-1.5 rounded-full bg-active" title="Active now"></span><span
                    class="sr-only">Active now</span
                  >
                </span>
                <span class="mt-px block text-[11px] leading-[13px] text-label-2">
                  atlas · Claude Code
                </span>
              </span>
              <span class="text-[12px] leading-[15px] text-label-2 tabular-nums">12.5%</span>
            </span>
            <span class="flex items-center gap-1.5 pt-0.5 text-[12px] leading-[15px] text-label-2">
              <Glyph name="lightbulb" class="shrink-0" />
              Start fresh per task. Replies re-read 966K.
            </span>
          </span>
        </span>
      {/if}
    </button>
  </div>

  <div class="px-2 pt-1.5">
    <button
      type="button"
      class="row flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left text-[12px] leading-[15px]"
      aria-expanded={restingOpen}
      onclick={() => {
        restingOpen = !restingOpen;
        if (!restingOpen) {
          chosen = undefined;
          showHidden = false;
        }
      }}
    >
      <span class="flex-1 text-label-2">2 not in use</span>
      {#if !restingOpen}
        <span class="text-label-3 tabular-nums" transition:fade={{ duration: 120 }}>
          ChatGPT Pro Lite 66%
        </span>
      {/if}
      {@render chevron(restingOpen)}
    </button>

    {#if restingOpen}
      <div transition:slide={room}>
        <!-- Rows 4 points apart, so one open, or pointed at, doesn't sit on the next. -->
        <div class="flex flex-col gap-1 pt-1" in:fade={appear}>
          {#each resting as account (account.name)}
            {@const usable = !!account.limit}
            <button
              type="button"
              class={[
                'row block w-full rounded-[10px] px-3 py-[7px] text-left',
                chosen === account.name && 'on',
              ]}
              aria-expanded={chosen === account.name}
              onclick={() => (chosen = chosen === account.name ? undefined : account.name)}
            >
              <span class="flex items-center gap-2">
                <Logo name={account.logo} class={usable ? 'size-3.5' : 'size-3.5 text-label-2'} />
                <span class="min-w-0 flex-1">
                  <span class={['block text-[12px] leading-[15px]', !usable && 'text-label-2']}>
                    {account.name}
                  </span>
                  <span class="block truncate text-[11px] leading-[13px] text-label-3">
                    {account.via}
                  </span>
                </span>
                {#if account.limit}
                  <Level
                    left={account.limit.left}
                    atReset={account.limit.atReset}
                    standing={account.limit.standing}
                    class="w-11"
                  />
                  <span class="w-9 text-right text-[12px] font-medium tabular-nums">
                    {account.limit.left}%
                  </span>
                {:else}
                  <span class="text-[12px] text-label-2">Sign in again</span>
                {/if}
              </span>
              {#if chosen === account.name}
                <span class="block" transition:slide={room}>
                  <span class="block pt-2.5 text-[12px] leading-[15px] text-label-2" in:fade={appear}>
                    {#if account.limit}
                      {@render rows([account.limit])}
                    {:else}
                      {account.trouble}
                    {/if}
                  </span>
                </span>
              {/if}
            </button>
          {/each}

          <button
            type="button"
            class="row flex w-full items-center gap-2 rounded-[10px] px-3 py-[7px] text-left text-[12px] leading-[15px]"
            aria-expanded={showHidden}
            onclick={() => (showHidden = !showHidden)}
          >
            <span class="flex-1 text-label-3">1 hidden</span>
            {@render chevron(showHidden)}
          </button>
          {#if showHidden}
            <div transition:slide={room}>
              <span class="flex items-center gap-2 px-3 py-[5px]" in:fade={appear}>
                <Logo name="openrouter" class="size-3.5 text-label-3" />
                <span class="min-w-0 flex-1">
                  <span class="block text-[12px] leading-[15px] text-label-2">OpenRouter API key</span>
                  <span class="block text-[11px] leading-[13px] text-label-3">via OpenCode, Pi</span>
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

<!-- Every limit: its name, its level and what's left, and its sentence under them. -->
{#snippet rows(list: Limit[])}
  <span class="flex flex-col gap-[9px]">
    {#each list as limit (limit.name)}
      <span class="flex gap-1.5">
        <span class="w-11 shrink-0 text-[11px] leading-[13px] font-medium text-label-2">
          {limit.name}
        </span>
        <span class="min-w-0 flex-1">
          <span class="flex h-[13px] items-center gap-1.5">
            <Level
              left={limit.left}
              atReset={limit.atReset}
              reserve={limit.reserve}
              standing={limit.standing}
              class="flex-1"
            />
            <span
              class="w-[34px] text-right text-[11px] leading-[13px] font-medium text-label-2 tabular-nums"
            >
              {limit.left}%
            </span>
          </span>
          <span
            class={[
              'mt-[5px] block text-[12px] leading-[15px]',
              limit.standing === 'short' ? 'text-amber' : 'text-label-2',
            ]}
          >
            {limit.sentence}
          </span>
          {#if limit.pace}
            <span class="mt-0.5 block text-[11px] leading-[13px] text-label-3">{limit.pace}</span>
          {/if}
        </span>
      </span>
    {/each}
  </span>
{/snippet}

{#snippet chevron(down: boolean)}
  <span class={['flex text-label-3 transition-transform duration-200', down && 'rotate-90']}>
    <Glyph name="chevron" />
  </span>
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
