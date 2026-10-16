import { exports } from 'cloudflare:workers';
import { describe, expect, it } from 'vite-plus/test';

import { site } from '@/lib/site';

const get = (path: string) => exports.default.fetch(`${site.origin}${path}`);

describe('pages', () => {
  it('renders the home page', async () => {
    const res = await get('/');
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Know before you run out');
    expect(html).toContain(`<link rel="canonical" href="${site.origin}/"/>`);
  });

  it('answers an unknown address with the not-found page', async () => {
    const res = await get('/nope');
    expect(res.status).toBe(404);
    expect(res.headers.get('x-frame-options')).toBe('DENY');
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(await res.text()).toContain('There’s no page here');
  });
});
