<script lang="ts">
  import type { Snippet } from 'svelte';

  // A terminal window, out of focus, as a Mac draws one behind the app in
  // front: its traffic lights gray, its title the folder and what runs in
  // it. What it shows is described by `label`, for those who can't see it.
  let {
    title,
    label,
    children,
    class: className = '',
  }: { title: string; label: string; children: Snippet; class?: string } = $props();
</script>

<div class={['min-w-0 overflow-hidden rounded-xl bg-panel shadow-note', className]} role="img" aria-label={label}>
  <div class="relative flex h-9 items-center px-3.5 shadow-[inset_0_-0.5px_0_var(--color-edge)]">
    <span class="flex gap-2">
      <span class="size-3 rounded-full bg-label-4"></span>
      <span class="size-3 rounded-full bg-label-4"></span>
      <span class="size-3 rounded-full bg-label-4"></span>
    </span>
    <span class="absolute inset-x-0 text-center text-[13px] font-semibold tracking-normal text-ink-3">
      {title}
    </span>
  </div>
  <div class="p-5 font-mono text-[13px] leading-[1.6] tracking-normal sm:p-6">
    {@render children()}
  </div>
</div>
