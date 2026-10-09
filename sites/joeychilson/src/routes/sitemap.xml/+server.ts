import { postPath } from '#lib/posts.js';
import { listPosts } from '#lib/server/posts.js';
import { site } from '#lib/site.js';

export const prerender = true;

export async function GET() {
  const urls: { loc: string; lastmod?: string }[] = [
    { loc: `${site.url}/` },
    ...(await listPosts()).map((post) => ({
      loc: new URL(postPath(post.slug), site.url).href,
      lastmod: (post.updated ?? post.date).toISOString().slice(0, 10),
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map(
      ({ loc, lastmod }) =>
        `\n  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
    )
    .join('')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
