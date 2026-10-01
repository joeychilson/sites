<script lang="ts">
  import type { Snippet } from 'svelte';

  // A Mac's desktop, under what the page draws of one: the menu bar, the
  // panel, notifications. Its wallpaper is waves in the page's grays, so the
  // glass over it reads as glass and the page keeps to the app's rule, that
  // color is only for a limit in trouble or a session at work. With `fade`,
  // it fades into the page at its foot.
  let {
    children,
    fade = false,
    class: className = '',
  }: { children?: Snippet; fade?: boolean; class?: string } = $props();

  const id = $props.id();
</script>

<div class={['desktop relative isolate overflow-hidden', className]}>
  <svg
    class={['pointer-events-none absolute inset-0 -z-10 size-full', fade && 'fade']}
    viewBox="0 0 1600 1000"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="{id}-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--wall-top)" />
        <stop offset="1" stop-color="var(--wall-foot)" />
      </linearGradient>
      <linearGradient id="{id}-crest" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" stop-color="var(--wall-crest)" />
        <stop offset="0.7" stop-color="var(--wall-crest)" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="{id}-swell" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--wall-swell)" />
        <stop offset="1" stop-color="var(--wall-swell)" stop-opacity="0.4" />
      </linearGradient>
      <linearGradient id="{id}-deep" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--wall-deep)" />
        <stop offset="1" stop-color="var(--wall-deep)" stop-opacity="0.6" />
      </linearGradient>
      <radialGradient id="{id}-glow" cx="0.78" cy="0.12" r="0.55">
        <stop offset="0" stop-color="var(--wall-glow)" />
        <stop offset="1" stop-color="var(--wall-glow)" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1600" height="1000" fill="url(#{id}-sky)" />
    <rect width="1600" height="1000" fill="url(#{id}-glow)" />
    <path d="M0 560C260 470 470 650 790 560S1290 240 1600 170V1000H0Z" fill="url(#{id}-crest)" />
    <path d="M0 700C330 600 620 820 960 690S1400 420 1600 380V1000H0Z" fill="url(#{id}-swell)" />
    <path d="M0 860C380 760 760 960 1120 840S1480 640 1600 620V1000H0Z" fill="url(#{id}-deep)" />
  </svg>
  {@render children?.()}
</div>

<style>
  .desktop {
    --wall-top: light-dark(#ececee, #202024);
    --wall-foot: light-dark(#d8d9de, #0f0f11);
    --wall-glow: light-dark(rgb(255 255 255 / 0.95), rgb(255 255 255 / 0.11));
    --wall-crest: light-dark(rgb(255 255 255 / 0.9), rgb(255 255 255 / 0.1));
    --wall-swell: light-dark(#cdced4, #19191c);
    --wall-deep: light-dark(#bdbec5, #0a0a0b);
  }

  .fade {
    mask-image: linear-gradient(to bottom, black 62%, transparent);
  }
</style>
