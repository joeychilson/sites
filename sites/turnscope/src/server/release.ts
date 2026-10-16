import { env } from 'void/env';
import { kv } from 'void/kv';
import * as z from 'zod';

import { site } from '../site';

// Visitors are sent wherever this points, so only GitHub's own https links pass.
const githubUrl = z.url({ protocol: /^https$/, hostname: /^github\.com$/ });

// Only what the link needs from GitHub's answer.
const LatestRelease = z.object({
  html_url: githubUrl,
  assets: z.array(z.object({ name: z.string(), browser_download_url: githubUrl })),
});

const KEY = 'download:latest';
const RELEASES = `${site.repo}/releases/latest`;
const MINUTE = 60;

/** The latest release's disk image, or its page when it has none. */
export async function latestDownload(): Promise<string> {
  const cached = await kv.get<string>(KEY).catch(cacheFailed);
  if (cached) return cached;

  const latest = await readLatest();
  // GitHub is asked again in 10 minutes, or in one when it couldn't be read.
  await kv.put(KEY, latest ?? RELEASES, { ttl: latest ? 10 * MINUTE : MINUTE }).catch(cacheFailed);
  return latest ?? RELEASES;
}

async function readLatest(): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos${new URL(site.repo).pathname}/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': new URL(site.url).host,
          ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
        },
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
    const release = LatestRelease.parse(await response.json());
    const diskImage = release.assets.find((asset) => asset.name.endsWith('.dmg'));
    return diskImage?.browser_download_url ?? release.html_url;
  } catch (error) {
    console.error('Couldn’t read the latest release:', error);
    return null;
  }
}

// The cache only spares GitHub, so the link works without it.
function cacheFailed(error: unknown) {
  console.error('The download cache failed:', error);
  return null;
}
