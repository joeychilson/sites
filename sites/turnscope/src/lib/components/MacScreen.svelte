<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Standing } from '#lib/components/Bar.svelte';
  import Glyph from '#lib/components/Glyph.svelte';
  import Item from '#lib/components/Item.svelte';

  // A Mac screen with a menu bar. Children are positioned in screen points;
  // the screen is drawn at `width` × `height` and scaled to fit. On phones,
  // `compact` is shown instead. `label` describes it for screen readers.
  let {
    app,
    item,
    clock,
    label,
    children,
    compact,
  }: {
    app: string;
    item: { figure: string; state: Standing };
    clock: string;
    label: string;
    children: Snippet;
    compact: Snippet;
  } = $props();

  const width = 1120;
  const height = 640;

  const menus = ['Shell', 'Edit', 'View'];

  let room = $state<number>();
  const scale = $derived(room ? Math.min(1, room / width) : 1);
</script>

<figure class="mx-auto w-full text-left" style:max-width="{width}px">
  <figcaption class="sr-only">{label}</figcaption>

  <div
    class="relative overflow-hidden max-sm:hidden"
    style:aspect-ratio="{width} / {height}"
    bind:clientWidth={room}
  >
    <div
      class="screen absolute top-0 left-0 origin-top-left"
      style:width="{width}px"
      style:height="{height}px"
      style:scale
    >
      {@render bar()}
      {@render children()}
    </div>
  </div>

  <div class="screen pb-8 sm:hidden">
    {@render bar()}
    <div class="flex justify-center px-3 pt-2">{@render compact()}</div>
  </div>
</figure>

<!-- Menu bar: app menus, Turnscope's item, system icons, clock. -->
{#snippet bar()}
  <div
    class="mac relative z-10 flex h-8 items-center gap-1 bg-black/20 px-2.5 text-[13px] font-medium backdrop-blur-md"
    aria-hidden="true"
  >
    <span class="px-2 font-bold max-sm:hidden">{app}</span>
    {#each menus as menu (menu)}
      <span class="px-2 font-normal max-sm:hidden">{menu}</span>
    {/each}
    <span class="flex-1"></span>
    <span class="rounded-[6px] bg-white/18 px-2 py-0.5"><Item figure={item.figure} state={item.state} /></span>
    <span class="px-1.5"><Glyph name="wifi" /></span>
    <span class="px-1.5"><Glyph name="controls" /></span>
    <span class="px-2 font-normal tabular-nums max-sm:hidden">{clock}</span>
  </div>
{/snippet}

<style>
  /* Wallpaper: gray gradients, with a warm glow behind the panel. */
  .screen {
    overflow: hidden;
    border-radius: 22px;
    background:
      radial-gradient(60% 55% at 78% 18%, rgb(237 148 25 / 0.14), transparent 70%),
      radial-gradient(70% 70% at 18% 82%, rgb(120 120 132 / 0.35), transparent 70%),
      radial-gradient(90% 80% at 60% 60%, rgb(70 70 78 / 0.6), transparent 75%),
      linear-gradient(160deg, #2a2a30, #0e0e11);
    box-shadow:
      0 0 0 0.5px rgb(255 255 255 / 0.12),
      0 40px 120px rgb(0 0 0 / 0.6);
  }
</style>
