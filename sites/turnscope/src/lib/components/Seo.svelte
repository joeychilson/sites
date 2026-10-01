<script lang="ts">
  import { page } from '$app/state';
  import { site } from '#lib/site.js';

  type Props = {
    /** Omit for the site's own title. */
    title?: string;
    /** Keeps the page out of search results, as for errors. */
    noindex?: boolean;
    /** Structured data for the page, as JSON-LD. */
    schema?: Record<string, unknown>;
  };

  let { title, noindex = false, schema }: Props = $props();

  const image = new URL('/social-card.png', site.url).href;
  const fullTitle = $derived(title ? `${title} — ${site.name}` : site.title);
  const url = $derived(new URL(page.url.pathname, site.url).href);
  // Escaping `<` keeps the data from closing its script tag early.
  const jsonLd = $derived(
    schema &&
      `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</` +
        'script>',
  );
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={site.description} />
  {#if noindex}
    <meta name="robots" content="noindex" />
  {:else}
    <link rel="canonical" href={url} />
  {/if}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={site.name} />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={site.description} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta
    property="og:image:alt"
    content="Turnscope’s panel, open under its menu bar item: Claude Max runs out in 2 hours, in amber. Stay under 6% an hour to last."
  />
  <meta name="twitter:card" content="summary_large_image" />
  {#if jsonLd}
    {@html jsonLd}
  {/if}
</svelte:head>
