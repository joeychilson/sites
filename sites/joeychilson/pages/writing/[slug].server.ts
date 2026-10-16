import { defineHandler, defineHead, type InferProps } from 'void';

import { jsonLd } from '../../src/json-ld';
import { parseMarkdown } from '../../src/server/markdown';
import { findPost, posts } from '../../src/server/posts';
import { site } from '../../src/site';

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  const post = findPost(c.req.param('slug'));
  if (!post) return c.notFound();
  const { body, ...rest } = post;
  return { post: rest, nodes: (await parseMarkdown(body)).nodes };
});

export const head = defineHead<Props>((_, { post }) => {
  const modified = post.updated ?? post.date;
  return {
    title: post.title,
    meta: [
      { name: 'description', content: post.description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: post.url },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.description },
      { property: 'article:published_time', content: post.date },
      { property: 'article:modified_time', content: modified },
    ],
    link: [{ rel: 'canonical', href: post.url }],
    script: [
      jsonLd({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        url: post.url,
        image: `${site.url}${site.image.path}`,
        datePublished: post.date,
        dateModified: modified,
        author: { '@type': 'Person', name: site.name, url: site.url },
      }),
    ],
  };
});

export function getPrerenderPaths() {
  return posts.map(({ slug }) => ({ slug }));
}
