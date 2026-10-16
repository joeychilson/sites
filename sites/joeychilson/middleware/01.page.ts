import { defineMiddleware } from 'void';

import { jsonLd } from '../src/json-ld';
import { type Post, posts } from '../src/posts';
import { site } from '../src/site';

declare module 'void' {
  interface CloudContextVariables {
    shared: { path: string; post: Post | null };
  }
}

/** Shares the current post with layouts, and gives each post its article metadata. */
export default defineMiddleware(async (c, next) => {
  const post = posts.find(({ path }) => path === c.req.path) ?? null;
  c.set('shared', { path: c.req.path, post });
  if (post) {
    const url = new URL(post.path, site.url).href;
    const modified = post.updated ?? post.published;
    c.set('headDefaults', {
      meta: [
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: url },
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.description },
        { property: 'article:published_time', content: post.published },
        { property: 'article:modified_time', content: modified },
      ],
      link: [{ rel: 'canonical', href: url }],
      script: [
        jsonLd({
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          url,
          image: new URL(site.image, site.url).href,
          datePublished: post.published,
          dateModified: modified,
          author: { '@type': 'Person', name: site.name, url: site.url },
        }),
      ],
    });
  }
  await next();
});
