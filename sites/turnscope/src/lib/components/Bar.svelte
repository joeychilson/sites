<script lang="ts" module>
  /** How a limit stands: it lasts, it runs out before it resets, or it's used up. */
  export type Standing = 'lasts' | 'short' | 'out';
</script>

<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  // A limit's bar (AccountRow.swift): gray while it lasts, amber while it
  // runs out, red when used up.

  let {
    left,
    standing = 'lasts',
    class: className,
  }: { left: number; standing?: Standing; class?: ClassValue } = $props();
</script>

<span class={['relative block h-[5px] rounded-full bg-label-4', className]}>
  {#if left > 0}
    <span
      class={[
        'fill absolute inset-y-0 left-0 rounded-full',
        standing === 'lasts' && 'bg-label-2',
        standing === 'short' && 'bg-amber',
        standing === 'out' && 'bg-red',
      ]}
      style:--to="max(5px, {left}%)"
    ></span>
  {/if}
</span>

<style>
  /* Fill from empty when first drawn. */
  .fill {
    width: var(--to);
    animation: fill 700ms var(--ease-spring) 60ms both;
  }

  @keyframes fill {
    from {
      width: 0;
    }
  }
</style>
