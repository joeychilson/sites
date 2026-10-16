import type { Thing } from 'schema-dts';

/** A head script with the page's structured data, escaped so it can't end its own script early. */
export function jsonLd(thing: Exclude<Thing, string>) {
  const data = JSON.stringify({ '@context': 'https://schema.org', ...thing });
  return { type: 'application/ld+json', innerHTML: data.replaceAll('<', '\\u003c') };
}
