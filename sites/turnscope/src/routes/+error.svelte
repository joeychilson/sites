<script lang="ts">
  import { page } from '$app/state';
  import Footer from '#lib/components/Footer.svelte';
  import MenuBar from '#lib/components/MenuBar.svelte';
  import Seo from '#lib/components/Seo.svelte';

  const missing = $derived(page.status === 404);
</script>

<Seo title={missing ? 'Page not found' : 'Something went wrong'} noindex />

<MenuBar item={false} />

<main id="main" class="column pt-20 pb-10 sm:pt-32">
  <p class="tabular-nums text-[15px] text-ink-3">{page.status}</p>
  <h1 class="title mt-2">{missing ? 'There’s no page here' : 'This page didn’t load'}</h1>
  <p class="lede mt-4 max-w-[30em]">
    {missing ? 'Check the address, or head back home.' : 'Try again in a moment.'}
  </p>
  <a class="button mt-8" href="/">Go home</a>
</main>

<Footer />
