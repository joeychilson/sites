import { exports } from 'cloudflare:workers';
import { describe, expect, it } from 'vite-plus/test';

import { listPosts } from '@/lib/posts.server';
import { site } from '@/lib/site';

const get = (path: string) => exports.default.fetch(`${site.origin}${path}`);

describe('pages', () => {
  it('renders the home page with every post', async () => {
    const res = await get('/');
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('<h1');
    for (const project of site.projects) {
      expect(html).toContain(project.title);
    }
    for (const post of listPosts()) {
      expect(html).toContain(`href="/writing/${post.slug}"`);
    }
  });

  it('renders each post', async () => {
    for (const post of listPosts()) {
      const res = await get(`/writing/${post.slug}`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain(`<title>${post.title} · ${site.name}</title>`);
      expect(html).toContain(`<link rel="canonical" href="${site.origin}/writing/${post.slug}"/>`);
    }
  });

  it.each(['/nope', '/writing/no-such-post'])(
    'answers %s with the not-found page',
    async (path) => {
      const res = await get(path);
      expect(res.status).toBe(404);
      expect(res.headers.get('x-frame-options')).toBe('DENY');
      expect(res.headers.get('x-content-type-options')).toBe('nosniff');
      expect(await res.text()).toContain('Not found');
    },
  );
});

describe('feeds', () => {
  it('lists every post in the RSS feed', async () => {
    const res = await get('/rss.xml');
    expect(res.headers.get('content-type')).toBe('application/rss+xml; charset=utf-8');
    const feed = await res.text();
    for (const post of listPosts()) {
      expect(feed).toContain(`<link>${site.origin}/writing/${post.slug}</link>`);
    }
  });

  it('lists the home page and every post in the sitemap', async () => {
    const res = await get('/sitemap.xml');
    expect(res.headers.get('content-type')).toBe('application/xml; charset=utf-8');
    const sitemap = await res.text();
    expect(sitemap).toContain(`<loc>${site.origin}/</loc>`);
    for (const post of listPosts()) {
      expect(sitemap).toContain(`<loc>${site.origin}/writing/${post.slug}</loc>`);
    }
  });
});
