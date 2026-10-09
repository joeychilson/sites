<script lang="ts">
  import Mark from '#lib/components/Mark.svelte';
  import { site } from '#lib/site.js';

  // Site header: name, links and the download button.
  const links = [
    { label: 'For agents', href: '/#agents' },
    { label: 'Privacy', href: '/#privacy' },
    { label: 'Install', href: '/#install' },
    { label: 'GitHub', href: site.repo },
  ];
</script>

<a
  href="#main"
  class="sr-only rounded-full bg-panel px-4 py-2 text-[15px] focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
>
  Skip to content
</a>

<header class="absolute inset-x-0 top-0 z-30">
  <div class="column flex h-16 items-center">
    <a href="/" class="flex items-center gap-2 text-[15px] font-semibold">
      <Mark class="size-4" />
      {site.name}
    </a>
    <nav class="ml-auto flex items-center gap-7 text-[14px] text-ink-2" aria-label="Site">
      {#each links as link (link.href)}
        <a class="transition-colors hover:text-ink max-sm:hidden" href={link.href}>{link.label}</a>
      {/each}
      <a
        class="flex h-8 items-center rounded-full bg-prominent px-4 text-[13px] font-semibold text-on-prominent"
        href="/download">Download</a
      >
    </nav>
  </div>
</header>
