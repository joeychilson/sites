<script lang="ts" module>
  /** How a limit stands: it lasts, it runs out before it resets, or it's used up. */
  export type Standing = 'lasts' | 'short' | 'out';
</script>

<script lang="ts">
  // A level, as a battery shows one (Level in AccountRow.swift): what's left,
  // and within it, solid, what will still be left when it resets at this
  // pace. With `reserve`, a mark where what's left would be, were it used
  // evenly until it resets; over a colored bar, it's drawn stronger.
  let {
    left,
    atReset,
    reserve,
    standing = 'lasts',
    class: className = '',
  }: {
    left: number;
    atReset?: number;
    reserve?: number;
    standing?: Standing;
    class?: string;
  } = $props();

  const solid = $derived(standing === 'lasts' && atReset ? Math.min(left, atReset) : 0);
  const mark = $derived(
    standing !== 'out' && reserve !== undefined
      ? Math.max(0, Math.min(100, left - reserve))
      : undefined,
  );
</script>

<span class={['relative block h-1.5 rounded-full bg-label-4', className]}>
  {#if left > 0}
    <span
      class={[
        'fill absolute inset-y-0 left-0 rounded-full',
        standing === 'lasts' && 'bg-label-3',
        standing === 'short' && 'bg-amber/90',
        standing === 'out' && 'bg-red/90',
      ]}
      style:--to="max(6px, {left}%)"
    ></span>
  {/if}
  {#if solid > 0}
    <span class="fill absolute inset-y-0 left-0 rounded-full bg-label-2" style:--to="max(6px, {solid}%)"
    ></span>
  {/if}
  {#if mark !== undefined}
    <span
      class={[
        'mark absolute top-1/2 h-2.5 w-0.5 -translate-y-1/2 rounded-full bg-label',
        standing === 'lasts' && 'opacity-60',
      ]}
      style:left="clamp(0px, calc({mark}% - 1px), calc(100% - 2px))"
    ></span>
  {/if}
</span>

<style>
  /* Levels fill from empty as they're first drawn, on the app's spring. */
  .fill {
    width: var(--to);
    animation: fill 700ms var(--ease-spring) 60ms both;
  }

  @keyframes fill {
    from {
      width: 0;
    }
  }

  .mark {
    animation: appear 200ms ease-out 400ms both;
  }

  @keyframes appear {
    from {
      opacity: 0;
    }
  }
</style>
