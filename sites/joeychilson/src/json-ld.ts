/** A head script holding structured data, escaped so it can't close its own tag. */
export function jsonLd(data: Record<string, unknown>) {
  return {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({ '@context': 'https://schema.org', ...data }).replaceAll(
      '<',
      '\\u003c',
    ),
  };
}
