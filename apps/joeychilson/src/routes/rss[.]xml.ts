import { createFileRoute } from '@tanstack/react-router';

import { listPosts } from '@/lib/posts.server';
import { site } from '@/lib/site';
import { escapeXml } from '@/lib/xml';

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: () => {
        const items = listPosts().map(
          (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${site.origin}/writing/${post.slug}</link>
      <guid isPermaLink="true">${site.origin}/writing/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
        );
        const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.origin}/</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <atom:link href="${site.origin}/rss.xml" rel="self" type="application/rss+xml"/>${items.join('')}
  </channel>
</rss>
`;
        return new Response(feed, {
          headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
        });
      },
    },
  },
});
