import { reset } from 'cloudflare:test';
import { exports } from 'cloudflare:workers';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';

import { site } from '@/lib/site';

const release = `${site.repo}/releases/tag/v1.0.0`;
const diskImage = `${site.repo}/releases/download/v1.0.0/Turnscope-1.0.0.dmg`;
const releasesPage = `${site.repo}/releases/latest`;

// Made inside each call: a body made in the test can't be read while the Worker answers a request.
function gitHubAnswers(answer: () => Response) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async () => answer());
}

async function download() {
  const response = await exports.default.fetch(`${site.origin}/download`, { redirect: 'manual' });
  expect(response.status).toBe(302);
  return response.headers.get('location');
}

afterEach(async () => {
  vi.restoreAllMocks();
  await reset();
});

describe('/download', () => {
  it('sends visitors to the latest disk image, asking GitHub with the token', async () => {
    const github = gitHubAnswers(() =>
      Response.json({
        html_url: release,
        assets: [
          { name: 'checksums.txt', browser_download_url: `${site.repo}/releases/download/sums` },
          { name: 'Turnscope-1.0.0.dmg', browser_download_url: diskImage },
        ],
      }),
    );
    expect(await download()).toBe(diskImage);
    const [, init] = github.mock.calls[0];
    expect(new Headers(init?.headers).get('authorization')).toBe('Bearer test-token');
  });

  it('sends them to the release when it has no disk image', async () => {
    gitHubAnswers(() => Response.json({ html_url: release, assets: [] }));
    expect(await download()).toBe(release);
  });

  it('asks GitHub only once while the answer is fresh', async () => {
    const github = gitHubAnswers(() => Response.json({ html_url: release, assets: [] }));
    await download();
    expect(await download()).toBe(release);
    expect(github).toHaveBeenCalledTimes(1);
  });

  it.each([
    [
      'links off github.com',
      () => Response.json({ html_url: 'https://example.com/turnscope.dmg', assets: [] }),
    ],
    ['an error', () => new Response('Not found', { status: 404 })],
    ['something else', () => Response.json({ message: 'API rate limit exceeded' })],
  ])('falls back to the releases page when GitHub answers with %s', async (_, answer) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    gitHubAnswers(answer);
    expect(await download()).toBe(releasesPage);
  });
});
