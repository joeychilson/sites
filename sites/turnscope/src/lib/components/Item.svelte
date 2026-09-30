<script lang="ts">
  import Logo from '#lib/components/Logo.svelte';

  // What the menu bar item says of Claude Max (MenuBarItem.swift): what is
  // left while it lasts; how long it has, in amber, once it runs out before
  // it resets; when it's back, in red, once used up.
  let { figure, state = 'lasts' }: { figure: string; state?: 'lasts' | 'short' | 'out' } =
    $props();
</script>

<span class="inline-flex items-center gap-1 text-[13px] font-medium whitespace-nowrap tabular-nums">
  <Logo name="anthropic" class="size-[15px]" />
  <span class={[state === 'short' && 'text-amber', state === 'out' && 'text-red']}>{figure}</span>
</span>
