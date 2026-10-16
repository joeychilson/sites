import type { VoidMdPage } from '@void/md/pages';
import { expect, test } from 'vite-plus/test';

// Importing posts.ts reads every post's frontmatter, so a bad post fails this file.
import { toPosts } from './posts';

function page(path: string, frontmatter: Record<string, unknown>): VoidMdPage {
  return { path, title: '', frontmatter, headings: [] };
}

test('keeps only writing pages, newest first', () => {
  const result = toPosts([
    page('/writing/older', { title: 'Older', description: 'A', date: '2025-01-02' }),
    page('/about', { title: 'About' }),
    page('/writing/newer', { title: 'Newer', description: 'B', date: '2026-03-04' }),
  ]);
  expect(result.map((post) => post.path)).toEqual(['/writing/newer', '/writing/older']);
});

test('reads YAML dates, which arrive as ISO timestamps', () => {
  const [post] = toPosts([
    page('/writing/post', {
      title: 'Post',
      description: 'A post',
      date: '2026-09-18T00:00:00.000Z',
      updated: '2026-10-05T00:00:00.000Z',
    }),
  ]);
  expect(post).toMatchObject({ published: '2026-09-18', updated: '2026-10-05' });
});

test('rejects a post without a description', () => {
  expect(() => toPosts([page('/writing/post', { title: 'Post', date: '2026-09-18' })])).toThrow(
    'pages/writing/post.md needs a description.',
  );
});

test('rejects an updated date before the published date', () => {
  expect(() =>
    toPosts([
      page('/writing/post', {
        title: 'Post',
        description: 'A post',
        date: '2026-09-18',
        updated: '2026-09-01',
      }),
    ]),
  ).toThrow('pages/writing/post.md has an updated date before its date.');
});

test('rejects an updated date that isn’t one', () => {
  expect(() =>
    toPosts([
      page('/writing/post', {
        title: 'Post',
        description: 'A post',
        date: '2026-09-18',
        updated: null,
      }),
    ]),
  ).toThrow('pages/writing/post.md needs its updated date as YYYY-MM-DD.');
});

test('rejects a date that isn’t one', () => {
  for (const date of ['2026-09-18-draft', '2026-02-31', '2026-13-01', '18 September 2026']) {
    expect(() =>
      toPosts([page('/writing/post', { title: 'Post', description: 'A post', date })]),
    ).toThrow('pages/writing/post.md needs a date as YYYY-MM-DD.');
  }
});

test('rejects an empty title', () => {
  expect(() =>
    toPosts([page('/writing/post', { title: ' ', description: 'A post', date: '2026-09-18' })]),
  ).toThrow('pages/writing/post.md needs a title.');
});
