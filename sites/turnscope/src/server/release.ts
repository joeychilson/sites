import { env } from 'void/env';
import { kv } from 'void/kv';

import { site } from '../site';

type Release = { html_url: string; assets: Array<{ name: string; browser_download_url: string }> };

const KEY = 'download:latest';
const FALLBACK = `${site.repo}/releases/latest`;

/**
 * The latest release's disk image, or its page when it has none. Cached for 10 minutes; when
 * GitHub can't be read, the releases page stands in for a minute before trying again.
 */
export async function latestDownload(): Promise<string> {
  const cached = await kv.get<string>(KEY).catch(cacheFailed);
  if (cached) return cached;

  const latest = await readLatest();
  await kv.put(KEY, latest ?? FALLBACK, { ttl: latest ? 600 : 60 }).catch(cacheFailed);
  return latest ?? FALLBACK;
}

async function readLatest(): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/joeychilson/turnscope/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'turnscope.app',
          ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
        },
        signal: AbortSignal.timeout(4000),
      },
    );
    const release: unknown = response.ok ? await response.json() : null;
    if (!isRelease(release)) throw new Error(`GitHub answered ${response.status}`);
    return (
      release.assets.find((asset) => asset.name.endsWith('.dmg'))?.browser_download_url ??
      release.html_url
    );
  } catch (error) {
    console.error('Could not read the latest release:', error);
    return null;
  }
}

// The cache only spares GitHub, so a download goes ahead without it.
function cacheFailed(error: unknown) {
  console.error('The download cache failed:', error);
  return null;
}

function isRelease(value: unknown): value is Release {
  const release = value as Partial<Release> | null;
  return typeof release?.html_url === 'string' && Array.isArray(release.assets);
}
