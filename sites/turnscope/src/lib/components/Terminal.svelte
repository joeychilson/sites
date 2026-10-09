<script lang="ts">
  import type { Snippet } from 'svelte';

  // A terminal window showing an agent's turn.
  let { title, children }: { title: string; children: Snippet } = $props();
</script>

<div class="overflow-hidden rounded-xl bg-[#1c1c1e]/95 shadow-[0_0_0_0.5px_rgb(255_255_255/0.14),0_24px_70px_rgb(0_0_0/0.55)]">
  <div class="relative flex h-9 items-center px-3.5">
    <span class="flex gap-2" aria-hidden="true">
      <span class="size-3 rounded-full bg-[#ff5f57]"></span>
      <span class="size-3 rounded-full bg-[#febc2e]"></span>
      <span class="size-3 rounded-full bg-[#28c840]"></span>
    </span>
    <span class="absolute inset-x-0 text-center text-[13px] font-semibold text-ink-3">{title}</span>
  </div>
  <div class="px-5 pt-2 pb-6 font-mono text-[13px] leading-[1.65] tracking-normal text-ink">
    {@render children()}
  </div>
</div>

<style>
  /* A line: a mark, then text indented after it. */
  div :global(.turn) {
    display: grid;
    grid-template-columns: 2ch minmax(0, 1fr);
  }

  /* Tool output, indented further. */
  div :global(.turn.out) {
    grid-template-columns: 3ch minmax(0, 1fr);
    padding-left: 2ch;
  }
</style>
