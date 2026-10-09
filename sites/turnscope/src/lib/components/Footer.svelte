<script lang="ts">
  import Mark from '#lib/components/Mark.svelte';
  import { site } from '#lib/site.js';

  const links = [
    { label: 'Source', href: site.repo },
    { label: 'Releases', href: `${site.repo}/releases` },
    { label: 'Issues', href: `${site.repo}/issues` },
    { label: 'License', href: `${site.repo}/blob/main/LICENSE` },
  ];
</script>

<footer class="column pt-24 pb-14 text-[13px] text-ink-3 sm:pt-32">
  <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <p class="flex items-center gap-2">
      <Mark class="size-3 text-ink-4" />
      <span>
        Made by <a class="text-ink-2 transition-colors hover:text-ink" href={site.author.url}
          >{site.author.name}</a
        >
      </span>
    </p>
    <nav aria-label="Project" class="flex flex-wrap gap-x-6 gap-y-2">
      {#each links as link (link.href)}
        <a class="transition-colors hover:text-ink" href={link.href}>{link.label}</a>
      {/each}
    </nav>
  </div>
  <p class="mt-6">Agent names and logos belong to their owners.</p>
</footer>
