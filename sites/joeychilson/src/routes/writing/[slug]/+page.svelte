<script lang="ts">
  import Seo from '#lib/components/Seo.svelte';
  import { copyButtons } from '#lib/copy.js';
  import { formatDate } from '#lib/posts.js';
  import { getPost } from '#lib/posts.remote.js';

  let { params } = $props();

  const post = $derived(await getPost(params.slug));
</script>

<Seo
  title={post.title}
  description={post.description}
  article={{ published: post.date, modified: post.updated }}
  noindex={post.draft}
/>

<article class="mt-16">
  <header>
    <h1 class="heading">
      <span data-post-title={post.slug}>{post.title}</span>
    </h1>
    <p class="mt-1 text-ink-3">
      {#if post.draft}Draft,{/if}
      <time datetime={post.date.toISOString()}>{formatDate(post.date)}</time>
      {#if post.updated}
        (updated <time datetime={post.updated.toISOString()}>{formatDate(post.updated)}</time>)
      {/if}
    </p>
  </header>
  <!-- Keyed, so moving from one post to another adds copy buttons to the new one's code. -->
  {#key post.slug}
    <div class="prose mt-8" {@attach copyButtons}>
      {@html post.html}
    </div>
  {/key}
</article>
