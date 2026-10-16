import { env } from 'cloudflare:workers';
import { z } from 'zod';

import { site } from '@/lib/site';

// Visitors are sent wherever this points, so only GitHub's own https links pass.
const githubLink = z.url({ protocol: /^https$/, hostname: /^github\.com$/ });

const LatestRelease = z.object({
  html_url: githubLink,
  assets: z.array(z.object({ name: z.string(), browser_download_url: githubLink })),
});

const releasesPage = `${site.repo}/releases/latest`;

// The Cache API keys on a URL, so the answer is stored under one that's never served.
const cacheKey = `${site.origin}/download/latest`;

export async function latestDownload(): Promise<string> {
  const cache = await caches.open('download');
  const cached = await cache.match(cacheKey);
  if (cached) {
    return cached.text();
  }
  const latest = await readLatest();
  const link = latest ?? releasesPage;
  // A failed read is tried again a minute later, so GitHub's next answer isn't long in coming.
  const maxAge = latest ? 600 : 60;
  await cache.put(
    cacheKey,
    new Response(link, { headers: { 'Cache-Control': `max-age=${maxAge}` } }),
  );
  return link;
}

async function readLatest(): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://api.github.com/repos${new URL(site.repo).pathname}/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': new URL(site.origin).host,
          // Optional in dev, where GitHub's unauthenticated limit is plenty.
          ...(env.GITHUB_TOKEN && { Authorization: `Bearer ${env.GITHUB_TOKEN}` }),
        },
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!response.ok) {
      throw new Error(`GitHub answered ${response.status}`);
    }
    const release = LatestRelease.parse(await response.json());
    const diskImage = release.assets.find((asset) => asset.name.endsWith('.dmg'));
    return diskImage?.browser_download_url ?? release.html_url;
  } catch (error) {
    console.error('Couldn’t read the latest release:', error);
    return undefined;
  }
}
