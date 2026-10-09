<script lang="ts">
  import Logo from '#lib/components/Logo.svelte';
  import type { Standing } from '#lib/components/Bar.svelte';

  // The menu bar item (MenuBarItem.swift): the figure is plain while the
  // limit lasts, amber while it runs out, red once used up.
  let { figure, state = 'lasts' }: { figure: string; state?: Standing } = $props();
</script>

<span class="inline-flex items-center gap-1 text-[14px] font-medium whitespace-nowrap tabular-nums">
  <Logo name="anthropic" class="size-[17px]" />
  <span class={[state === 'short' && 'text-amber', state === 'out' && 'text-red']}>{figure}</span>
</span>
