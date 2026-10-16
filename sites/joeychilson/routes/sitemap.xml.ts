import { defineHandler } from 'void';

import { posts } from '../src/server/posts';
import { site } from '../src/site';

export const GET = defineHandler((c) => {
  const urls = [
    `<url><loc>${site.url}/</loc></url>`,
    ...posts.map(
      (post) => `<url><loc>${post.url}</loc><lastmod>${post.updated ?? post.date}</lastmod></url>`,
    ),
  ];

  return c.body(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>
`,
    200,
    {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  );
});
