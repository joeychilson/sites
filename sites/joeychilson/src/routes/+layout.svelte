<script lang="ts">
  import '@fontsource-variable/inter/opsz.css';
  import inter from '@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2?url';
  import '../app.css';
  import { onNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import Skyline from '#lib/components/Skyline.svelte';
  import { site } from '#lib/site.js';
  import { Theme } from '#lib/theme.svelte.js';

  let { children } = $props();

  const theme = new Theme();
  const home = $derived(page.route.id === '/');

  // Pages crossfade inside a view transition (see `app.css`). Opening a post
  // from the list, or going back to it, its title glides between the two,
  // but only when it's on screen at both ends: from out of view it would
  // fly across the page.
  onNavigate((navigation) => {
    const { from, to } = navigation;
    if (!document.startViewTransition || !to || from?.url.pathname === to.url.pathname) return;

    const slug = (url?: URL) => url && /^\/writing\/([^/]+)$/.exec(url.pathname)?.[1];
    const post = slug(to.url) ?? slug(from?.url);
    const title = () =>
      post ? document.querySelector<HTMLElement>(`[data-post-title="${CSS.escape(post)}"]`) : null;
    const onScreen = (element: HTMLElement | null) => {
      const box = element?.getBoundingClientRect();
      return !!box && box.bottom > 0 && box.top < innerHeight;
    };

    const leaving = title();
    const glide = onScreen(leaving);
    if (glide) leaving!.style.viewTransitionName = 'post-title';

    return new Promise((resolve) => {
      const transition = document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
        const arriving = title();
        if (glide && onScreen(arriving)) arriving!.style.viewTransitionName = 'post-title';
      });
      void transition.finished.finally(() => {
        for (const element of document.querySelectorAll<HTMLElement>('[data-post-title]'))
          element.style.viewTransitionName = '';
      });
    });
  });
</script>

<svelte:head>
  <link rel="preload" href={inter} as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="alternate" type="application/rss+xml" title={site.name} href="/rss.xml" />
</svelte:head>

<div class="column pt-10 pb-24 sm:pt-20">
  <!-- The same on every page, so it holds still as pages crossfade beneath it. -->
  <header>
    <Skyline {theme} />
    <!-- On the home page the name is its heading; elsewhere it leads home. -->
    <svelte:element
      this={home ? 'h1' : 'a'}
      href={home ? undefined : '/'}
      class={[
        'mt-8 block w-fit font-pixel text-[33px] leading-[33px]',
        !home && 'transition-colors hover:text-ink-2',
      ]}
    >
      {site.name}
    </svelte:element>
  </header>

  <main>
    {@render children()}
  </main>
</div>
