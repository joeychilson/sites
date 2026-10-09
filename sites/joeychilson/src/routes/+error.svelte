<script lang="ts">
  import { page } from '$app/state';
  import Seo from '#lib/components/Seo.svelte';

  const missing = $derived(page.status === 404);
</script>

<Seo title={missing ? 'Not found' : 'Something went wrong'} noindex />

<h1 class="heading mt-16">{missing ? 'Not found' : 'Something went wrong'}</h1>
<p class="mt-1 text-ink-3">
  {missing ? 'There’s nothing at this address.' : 'Try again in a moment.'}
</p>
