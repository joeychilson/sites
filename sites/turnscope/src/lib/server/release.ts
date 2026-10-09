import { GITHUB_TOKEN } from '$app/env/private';
import { site } from '#lib/site.js';

const API = `https://api.github.com/repos${new URL(site.repo).pathname}/releases/latest`;

/** How long an answer from GitHub is kept, and how long a failure is. */
const FRESH_MS = 10 * 60 * 1000;
const RETRY_MS = 60 * 1000;

const fallback = `${site.repo}/releases/latest`;

/** The part of GitHub's release that's read. Anything else throws, and falls back. */
type Release = { html_url: string; assets?: { name: string; browser_download_url: string }[] };

let kept: { download: string; until: number } | undefined;
let pending: Promise<string> | undefined;

/**
 * The latest release's disk image, or its page when it has none, from
 * GitHub. Answers are kept for a while, as calls to GitHub are limited: 60
 * an hour without `GITHUB_TOKEN`.
 */
export function latestDownload(): Promise<string> {
  if (kept && Date.now() < kept.until) return Promise.resolve(kept.download);
  return (pending ??= fetchDownload().finally(() => (pending = undefined)));
}

async function fetchDownload(): Promise<string> {
  try {
    const response = await fetch(API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'turnscope.app',
        ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
      },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
    const { html_url, assets = [] } = (await response.json()) as Release;
    const download =
      assets.find((asset) => asset.name.endsWith('.dmg'))?.browser_download_url ?? html_url;
    if (typeof download !== 'string') throw new Error('Unexpected release');
    kept = { download, until: Date.now() + FRESH_MS };
    return download;
  } catch (error) {
    console.error('Could not read the latest release:', error);
    // Keep serving the last answer, if there was one, and ask again soon.
    const download = kept?.download ?? fallback;
    kept = { download, until: Date.now() + RETRY_MS };
    return download;
  }
}
