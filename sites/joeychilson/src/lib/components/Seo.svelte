<script lang="ts">
  import { page } from '$app/state';
  import { site } from '#lib/site.js';

  type Props = {
    /** Omit for the name alone. */
    title?: string;
    description?: string;
    /** Marks the page as a post, with its dates. */
    article?: { published: Date; modified?: Date };
    /** Keeps the page out of search results, as for drafts and errors. */
    noindex?: boolean;
  };

  let { title, description = site.description, article, noindex = false }: Props = $props();

  const image = new URL('/social-card.png', site.url).href;
  const fullTitle = $derived(title ? `${title} — ${site.name}` : site.name);
  const url = $derived(new URL(page.url.pathname, site.url).href);
  const author = { '@type': 'Person', name: site.name, url: site.url };
  const schema = $derived(
    article
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description,
          url,
          image,
          datePublished: article.published.toISOString(),
          dateModified: (article.modified ?? article.published).toISOString(),
          author,
        }
      : { '@context': 'https://schema.org', ...author, sameAs: [site.github, site.x] },
  );
  // Escaping `<` keeps the data from closing its script tag early.
  const jsonLd = $derived(
    `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</` +
      'script>',
  );
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <meta name="author" content={site.name} />
  {#if noindex}
    <meta name="robots" content="noindex" />
  {:else}
    <link rel="canonical" href={url} />
  {/if}
  <meta property="og:type" content={article ? 'article' : 'profile'} />
  <meta property="og:site_name" content={site.name} />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Joey Chilson, above a pixel city at night." />
  <meta name="twitter:card" content="summary_large_image" />
  {#if article}
    <meta property="article:published_time" content={article.published.toISOString()} />
    {#if article.modified}
      <meta property="article:modified_time" content={article.modified.toISOString()} />
    {/if}
  {/if}
  {#if !noindex}
    {@html jsonLd}
  {/if}
</svelte:head>
