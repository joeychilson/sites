<script lang="ts">
  import Logo from '#lib/components/Logo.svelte';
  import type { Standing } from '#lib/components/Level.svelte';

  // What the menu bar item says of Claude Max (MenuBarItem.swift): what is
  // left while it lasts, in the menu bar's own color; in amber once it runs
  // out before it resets, counting down within three hours of that; when
  // it's back, in red, once used up. The logo stays in the menu bar's color.
  let { figure, state = 'lasts' }: { figure: string; state?: Standing } = $props();
</script>

<span class="inline-flex items-center gap-1 text-[14px] font-medium whitespace-nowrap tabular-nums">
  <Logo name="anthropic" class="size-[17px]" />
  <span class={[state === 'short' && 'text-amber', state === 'out' && 'text-red']}>{figure}</span>
</span>
