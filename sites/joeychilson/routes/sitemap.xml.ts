import { defineHandler } from 'void';

import { posts } from '../src/posts';
import { site } from '../src/site';
import { xmlResponse } from '../src/xml';

export const GET = defineHandler(() => {
  const urls = [
    `<url><loc>${site.url}/</loc></url>`,
    ...posts.map(
      (post) =>
        `<url><loc>${new URL(post.path, site.url).href}</loc><lastmod>${post.updated ?? post.published}</lastmod></url>`,
    ),
  ];

  return xmlResponse(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>
`,
    'application/xml',
  );
});
