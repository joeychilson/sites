import { createFileRoute } from '@tanstack/react-router';

import { listPosts } from '@/lib/posts.server';
import { site } from '@/lib/site';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const urls = [
          `<url><loc>${site.origin}/</loc></url>`,
          ...listPosts().map(
            (post) =>
              `<url><loc>${site.origin}/writing/${post.slug}</loc><lastmod>${post.updated ?? post.date}</lastmod></url>`,
          ),
        ];
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>
`;
        return new Response(sitemap, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        });
      },
    },
  },
});
