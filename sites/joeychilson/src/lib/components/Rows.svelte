<script lang="ts" module>
  export type Row = {
    href: string;
    title: string;
    meta: string;
    note?: string;
    /** A post's slug, so its title can glide into the post; see `+layout.svelte`. */
    post?: string;
  };
</script>

<script lang="ts">
  /** `stack` sets a long `meta` under its title on a phone, rather than beside it. */
  let { rows, stack = false }: { rows: Row[]; stack?: boolean } = $props();

  // One highlight for the whole list. It fades in on the row the pointer
  // enters, glides from row to row, and fades out where it is when the
  // pointer leaves, so coming from another list it never slides in.
  let spot = $state({ top: 0, height: 0 });
  let shown = $state(false);
  let glide = $state(false);

  function point(row: HTMLElement) {
    glide = shown;
    spot = { top: row.offsetTop, height: row.offsetHeight };
    shown = true;
  }

  function leave() {
    shown = false;
  }
</script>

<ul
  class="relative -mx-3"
  onpointerleave={leave}
  onfocusout={leave}
>
  <span
    class={[
      'pointer-events-none absolute inset-x-0 top-0 rounded-lg bg-fill duration-250 ease-(--ease-out)',
      glide ? 'transition-[translate,height,opacity]' : 'transition-opacity',
      shown ? 'opacity-100' : 'opacity-0',
    ]}
    style:translate="0 {spot.top}px"
    style:height="{spot.height}px"
    aria-hidden="true"
  ></span>
  {#each rows as row (row.href)}
    <li>
      <a
        class={[
          'relative flex justify-between rounded-lg px-3 py-2',
          stack ? 'flex-col sm:flex-row sm:items-baseline sm:gap-6' : 'items-baseline gap-6',
        ]}
        href={row.href}
        onpointerenter={(event) => point(event.currentTarget)}
        onfocus={(event) => point(event.currentTarget)}
      >
        <span class="min-w-0 truncate">
          <span data-post-title={row.post}>{row.title}</span>
          {#if row.note}<span class="ml-1.5 text-ink-3">{row.note}</span>{/if}
        </span>
        <span class={['text-ink-3 tabular-nums', !stack && 'shrink-0']}>{row.meta}</span>
      </a>
    </li>
  {/each}
</ul>
