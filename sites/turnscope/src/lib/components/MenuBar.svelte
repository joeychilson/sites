<script lang="ts">
  import Glyph from '#lib/components/Glyph.svelte';
  import Item from '#lib/components/Item.svelte';
  import Mark from '#lib/components/Mark.svelte';
  import { site } from '#lib/site.js';

  // The page's header, as the menu bar Turnscope lives in: its name and menus
  // on the left, and on the right its item, which opens the panel under it,
  // beside the system's own items and the clock. It's the time the panel's
  // feed was drawn. Over a desktop it's clear, as macOS draws it; elsewhere,
  // it keeps a bar.
  let {
    open = $bindable(),
    item = true,
    desktop = false,
  }: { open?: boolean; item?: boolean; desktop?: boolean } = $props();
</script>

<a
  href="#main"
  class="sr-only rounded-full bg-panel px-4 py-2 text-[15px] shadow-panel focus:not-sr-only focus:fixed focus:top-10 focus:left-4 focus:z-50"
>
  Skip to content
</a>

<!-- Over the desktop, above the panel's page, as the menu bar is above every window. -->
<header class={[desktop ? 'relative z-20' : 'bg-bar backdrop-blur-xl']}>
  <div class="column flex h-8 items-center gap-1 text-[13px] font-medium tracking-normal">
    <a href="/" class="menu -ml-2 flex items-center gap-2 font-bold">
      <Mark class="size-3.5" />
      {site.name}
    </a>
    <nav class="flex items-center gap-1" aria-label="Site">
      <a class="menu font-normal" href="/download">Download</a>
      <span class="max-sm:hidden"><a class="menu font-normal" href={site.repo}>GitHub</a></span>
    </nav>
    <span class="flex-1"></span>
    {#if item}
      <button
        type="button"
        class={['menu', open && 'bg-highlight']}
        aria-expanded={open}
        aria-controls="panel"
        aria-label="Turnscope: Claude Max runs out in 2 hours"
        onclick={() => (open = !open)}
      >
        <Item figure="2h" state="short" />
      </button>
    {/if}
    <span class="flex items-center max-md:hidden" aria-hidden="true">
      <span class="menu"><Glyph name="wifi" /></span>
      <span class="menu"><Glyph name="spotlight" /></span>
      <span class="menu"><Glyph name="controls" /></span>
    </span>
    <span class="-mr-2 font-normal tabular-nums" aria-hidden="true">
      <span class="menu max-sm:hidden!">Wed Sep 30 7:00 AM</span>
      <span class="menu sm:hidden!">7:00 AM</span>
    </span>
  </div>
</header>

<style>
  /* A menu title: it fills while pointed at, or its menu is open. */
  .menu {
    display: inline-flex;
    height: 24px;
    align-items: center;
    padding-inline: 8px;
    border-radius: 7px;
    cursor: default;
    white-space: nowrap;
    transition: background-color 100ms;
  }

  a.menu:hover,
  button.menu:hover {
    background: var(--color-highlight);
  }
</style>
