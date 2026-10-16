import { defineHandler, defineHead, type InferProps } from 'void';

import { jsonLd } from '../src/json-ld';
import { posts } from '../src/server/posts';
import { site } from '../src/site';

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(() => ({
  posts: posts.map(({ path, title, date, draft, transitionName }) => ({
    path,
    title,
    date,
    draft,
    transitionName,
  })),
}));

export const head = defineHead(() => ({
  meta: [
    { property: 'og:type', content: 'profile' },
    { property: 'og:url', content: `${site.url}/` },
  ],
  link: [{ rel: 'canonical', href: `${site.url}/` }],
  script: [
    jsonLd({
      '@type': 'Person',
      name: site.name,
      url: site.url,
      email: `mailto:${site.email}`,
      sameAs: site.profiles.map(({ href }) => href),
    }),
  ],
}));
