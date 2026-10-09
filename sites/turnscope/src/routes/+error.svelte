<script lang="ts">
  import { page } from '$app/state';
  import Footer from '#lib/components/Footer.svelte';
  import Header from '#lib/components/Header.svelte';
  import Seo from '#lib/components/Seo.svelte';

  const missing = $derived(page.status === 404);
</script>

<Seo title={missing ? 'Page not found' : 'Something went wrong'} noindex />

<Header />

<main id="main" class="px-6 pt-40 pb-10 text-center sm:pt-52">
  <p class="text-[15px] text-ink-3 tabular-nums">{page.status}</p>
  <h1 class="mt-3 text-[44px] leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-[64px]">
    {missing ? 'There’s no page here' : 'This page didn’t load'}
  </h1>
  <p class="mx-auto mt-6 max-w-[28em] text-[18px] text-ink-2">
    {missing ? 'Check the address, or head back home.' : 'Try again in a moment.'}
  </p>
  <div class="mt-10"><a class="button" href="/">Go home</a></div>
</main>

<Footer />
