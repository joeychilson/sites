<script lang="ts">
  import Rows from '#lib/components/Rows.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import { formatMonth, postPath } from '#lib/posts.js';
  import { getPosts } from '#lib/posts.remote.js';
  import { projects, site } from '#lib/site.js';

  const posts = await getPosts();
</script>

<Seo />

<nav class="mt-4 flex gap-5 text-ink-2" aria-label="Elsewhere">
  <a class="link" href={site.github} rel="me">GitHub</a>
  <a class="link" href={site.x} rel="me">X</a>
  <a class="link" href="mailto:{site.email}">Email</a>
</nav>

<section class="mt-16" aria-labelledby="projects">
  <h2 id="projects" class="text-ink-3">Projects</h2>
  <div class="mt-2">
    <Rows rows={projects} stack />
  </div>
</section>

{#if posts.length}
  <section class="mt-12" aria-labelledby="writing">
    <div class="flex items-baseline justify-between">
      <h2 id="writing" class="text-ink-3">Writing</h2>
      <a class="text-ink-3 transition-colors hover:text-ink" href="/rss.xml">RSS</a>
    </div>
    <div class="mt-2">
      <Rows
        rows={posts.map((post) => ({
          href: postPath(post.slug),
          title: post.title,
          meta: formatMonth(post.date),
          note: post.draft ? 'Draft' : undefined,
          post: post.slug,
        }))}
      />
    </div>
  </section>
{/if}
