import { postPath } from '#lib/posts.js';
import { escape, listPosts } from '#lib/server/posts.js';
import { site } from '#lib/site.js';

export const prerender = true;

export async function GET() {
  const items = (await listPosts()).map((post) => {
    const link = new URL(postPath(post.slug), site.url).href;
    return `
    <item>
      <title>${escape(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escape(post.description)}</description>
      <pubDate>${post.date.toUTCString()}</pubDate>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <description>${escape(site.description)}</description>
    <link>${site.url}/</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>${items.join('')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
