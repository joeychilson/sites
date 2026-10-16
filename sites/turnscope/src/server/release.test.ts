import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test';

import { latestDownload } from './release';

// An in-memory stand-in for Workers KV, honoring each entry's time to live.
const { kv, env } = vi.hoisted(() => {
  const entries = new Map<string, { value: string; expires: number }>();
  return {
    kv: {
      get: vi.fn(async (key: string) => {
        const entry = entries.get(key);
        return entry && Date.now() < entry.expires ? entry.value : null;
      }),
      put: vi.fn(async (key: string, value: string, { ttl }: { ttl: number }) => {
        entries.set(key, { value, expires: Date.now() + ttl * 1000 });
      }),
      clear: () => entries.clear(),
    },
    env: { GITHUB_TOKEN: undefined as string | undefined },
  };
});

vi.mock('void/kv', () => ({ kv }));
vi.mock('void/env', () => ({ env }));

const RELEASES = 'https://github.com/joeychilson/turnscope/releases';
const FALLBACK = `${RELEASES}/latest`;
const MINUTE = 60 * 1000;

const diskImage = (version: string) => `${RELEASES}/download/v${version}/Turnscope-${version}.dmg`;

function release(version: string, assets?: Array<unknown>) {
  return {
    html_url: `${RELEASES}/tag/v${version}`,
    assets: assets ?? [
      { name: `Turnscope-${version}.dmg`, browser_download_url: diskImage(version) },
    ],
  };
}

function githubAnswers(body: unknown, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json(body, { status })),
  );
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  kv.clear();
  env.GITHUB_TOKEN = undefined;
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
});

test('links to the release’s disk image', async () => {
  githubAnswers(
    release('0.1.4', [
      { name: 'Turnscope-0.1.4.zip', browser_download_url: `${RELEASES}/download/v0.1.4/x.zip` },
      { name: 'Turnscope-0.1.4.dmg', browser_download_url: diskImage('0.1.4') },
    ]),
  );
  expect(await latestDownload()).toBe(diskImage('0.1.4'));
});

test('links to the release’s page when it has no disk image', async () => {
  githubAnswers(release('0.1.4', []));
  expect(await latestDownload()).toBe(`${RELEASES}/tag/v0.1.4`);
});

test('keeps the same link for 10 minutes', async () => {
  githubAnswers(release('0.1.4'));
  await latestDownload();
  githubAnswers(release('0.1.5'));
  vi.advanceTimersByTime(10 * MINUTE - 1);
  expect(await latestDownload()).toBe(diskImage('0.1.4'));
  vi.advanceTimersByTime(1);
  expect(await latestDownload()).toBe(diskImage('0.1.5'));
});

test('falls back to the releases page for a minute when GitHub fails', async () => {
  githubAnswers({ message: 'API rate limit exceeded' }, 403);
  expect(await latestDownload()).toBe(FALLBACK);
  githubAnswers(release('0.1.4'));
  vi.advanceTimersByTime(MINUTE - 1);
  expect(await latestDownload()).toBe(FALLBACK);
  vi.advanceTimersByTime(1);
  expect(await latestDownload()).toBe(diskImage('0.1.4'));
});

test.each([
  ['no release', { message: 'Not Found' }],
  ['an asset without a name', release('0.1.4', [{ size: 1 }])],
  ['a link that isn’t one', release('0.1.4', [{ name: 'a.dmg', browser_download_url: 42 }])],
  [
    'a link off GitHub',
    release('0.1.4', [{ name: 'a.dmg', browser_download_url: 'https://example.com/a.dmg' }]),
  ],
])('falls back when GitHub answers with %s', async (_, body) => {
  githubAnswers(body);
  expect(await latestDownload()).toBe(FALLBACK);
});

test('gets past the rate limit with the token', async () => {
  env.GITHUB_TOKEN = 'token';
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init?: RequestInit) =>
      new Headers(init?.headers).get('Authorization') === 'Bearer token'
        ? Response.json(release('0.1.4'))
        : Response.json({ message: 'API rate limit exceeded' }, { status: 403 }),
    ),
  );
  expect(await latestDownload()).toBe(diskImage('0.1.4'));
});

test('still links to the download when the cache fails', async () => {
  kv.get.mockRejectedValueOnce(new Error('KV is down'));
  kv.put.mockRejectedValueOnce(new Error('KV is down'));
  githubAnswers(release('0.1.4'));
  expect(await latestDownload()).toBe(diskImage('0.1.4'));
});
