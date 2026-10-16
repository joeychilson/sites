import { defineHandler } from 'void';

import { posts } from '../src/posts';
import { site } from '../src/site';
import { escapeXml, xmlResponse } from '../src/xml';

export const GET = defineHandler(() => {
  const items = posts.map((post) => {
    const url = new URL(post.path, site.url).href;
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.published).toUTCString()}</pubDate>
    </item>`;
  });

  return xmlResponse(
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}/</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>${items.join('')}
  </channel>
</rss>
`,
    'application/rss+xml',
  );
});
