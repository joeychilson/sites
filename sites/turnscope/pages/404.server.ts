import { defineHead } from 'void';

import { site } from '../src/site';

export const head = defineHead(() => ({
  title: `Not found · ${site.name}`,
  meta: [{ name: 'robots', content: 'noindex' }],
}));
