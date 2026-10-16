import { defineHead } from 'void';

import { site } from '../src/site';

const app = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}${site.image}`,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: site.requires,
  downloadUrl: `${site.url}/download`,
  license: 'https://opensource.org/licenses/MIT',
  author: { '@type': 'Person', name: site.author.name, url: site.author.url },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export const head = defineHead(() => ({
  meta: [{ property: 'og:url', content: `${site.url}/` }],
  link: [{ rel: 'canonical', href: `${site.url}/` }],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(app) }],
}));
