import { defineHead } from 'void';

import { jsonLd } from '../src/json-ld';
import { site } from '../src/site';

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
      sameAs: site.profiles.map(({ href }) => href),
    }),
  ],
}));
