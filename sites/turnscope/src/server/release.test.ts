import { beforeEach, expect, test, vi } from 'vite-plus/test';

import { latestDownload } from './release';

const { store, kv, env } = vi.hoisted(() => {
  const store = new Map<string, { value: string; ttl: number }>();
  return {
    store,
    kv: {
      get: vi.fn(async (key: string) => store.get(key)?.value ?? null),
      put: vi.fn(async (key: string, value: string, { ttl }: { ttl: number }) => {
        store.set(key, { value, ttl });
      }),
    },
    env: { GITHUB_TOKEN: undefined as string | undefined },
  };
});

vi.mock('void/kv', () => ({ kv }));
vi.mock('void/env', () => ({ env }));

const RELEASES = 'https://github.com/joeychilson/turnscope/releases';
const DMG = `${RELEASES}/download/v0.1.4/Turnscope-0.1.4.dmg`;

function answer(body: unknown, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json(body, { status })),
  );
}

beforeEach(() => {
  store.clear();
  kv.get.mockClear();
  kv.put.mockClear();
  env.GITHUB_TOKEN = undefined;
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

test('picks the release’s disk image and caches it for 10 minutes', async () => {
  answer({
    html_url: `${RELEASES}/tag/v0.1.4`,
    assets: [
      { name: 'Turnscope-0.1.4.zip', browser_download_url: `${RELEASES}/download/v0.1.4/x.zip` },
      { name: 'Turnscope-0.1.4.dmg', browser_download_url: DMG },
    ],
  });
  expect(await latestDownload()).toBe(DMG);
  expect(store.get('download:latest')).toEqual({ value: DMG, ttl: 600 });
});

test('answers from the cache without asking GitHub', async () => {
  store.set('download:latest', { value: DMG, ttl: 600 });
  answer({});
  expect(await latestDownload()).toBe(DMG);
  expect(fetch).not.toHaveBeenCalled();
});

test('sends the token when one is set', async () => {
  env.GITHUB_TOKEN = 'token';
  answer({ html_url: `${RELEASES}/tag/v0.1.4`, assets: [] });
  await latestDownload();
  const [, init] = vi.mocked(fetch).mock.calls[0];
  expect(init?.headers).toMatchObject({ Authorization: 'Bearer token' });
});

test('sends the release page when it has no disk image', async () => {
  answer({ html_url: `${RELEASES}/tag/v0.1.4`, assets: [] });
  expect(await latestDownload()).toBe(`${RELEASES}/tag/v0.1.4`);
});

test('falls back to the releases page for a minute when GitHub fails', async () => {
  answer({ message: 'API rate limit exceeded' }, 403);
  expect(await latestDownload()).toBe(`${RELEASES}/latest`);
  expect(store.get('download:latest')).toEqual({ value: `${RELEASES}/latest`, ttl: 60 });
});

test('falls back when GitHub answers with something else', async () => {
  answer({ html_url: `${RELEASES}/tag/v0.1.4`, assets: [{ size: 1 }] });
  expect(await latestDownload()).toBe(`${RELEASES}/latest`);
});

test('still downloads when the cache fails', async () => {
  kv.get.mockRejectedValueOnce(new Error('KV is down'));
  kv.put.mockRejectedValueOnce(new Error('KV is down'));
  answer({
    html_url: `${RELEASES}/tag/v0.1.4`,
    assets: [{ name: 'a.dmg', browser_download_url: DMG }],
  });
  expect(await latestDownload()).toBe(DMG);
});
