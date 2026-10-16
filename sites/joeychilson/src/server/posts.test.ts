import { expect, test } from 'vite-plus/test';

import { parseMarkdown } from './markdown';
// Importing posts reads every real post, so a post with bad frontmatter fails this file.
import { readPosts } from './posts';

const post = (frontmatter: string) => `---\n${frontmatter}\n---\n\nThe body.\n`;
const valid = 'title: A post\ndescription: What it says.\ndate: 2026-09-18';

test('lists posts newest first, with their addresses', () => {
  const posts = readPosts(
    {
      '../../posts/older.md': post('title: Older\ndescription: A.\ndate: 2025-01-02'),
      '../../posts/newer.md': post('title: Newer\ndescription: B.\ndate: 2026-03-04'),
    },
    { drafts: false },
  );
  expect(posts.map(({ slug, path, url }) => ({ slug, path, url }))).toEqual([
    { slug: 'newer', path: '/writing/newer', url: 'https://joeychilson.com/writing/newer' },
    { slug: 'older', path: '/writing/older', url: 'https://joeychilson.com/writing/older' },
  ]);
});

test('leaves drafts out unless asked for them', () => {
  const files = {
    '../../posts/done.md': post(valid),
    '../../posts/draft.md': post(`${valid}\ndraft: true`),
  };
  expect(readPosts(files, { drafts: false }).map(({ slug }) => slug)).toEqual(['done']);
  expect(readPosts(files, { drafts: true }).map(({ slug }) => slug)).toEqual(['done', 'draft']);
});

test('keeps the body without its frontmatter', () => {
  const [only] = readPosts({ '../../posts/a.md': post(valid) }, { drafts: false });
  expect(only?.body.trim()).toBe('The body.');
});

test.each([
  ['a missing description', 'title: A post\ndate: 2026-09-18', 'description'],
  ['a day not on the calendar', valid.replace('2026-09-18', '2026-02-30'), 'date'],
  ['an updated date before the date', `${valid}\nupdated: 2026-09-01`, 'updated'],
  ['a misspelled field', `${valid}\ndescripton: Oops.`, 'descripton'],
])('rejects %s', (_, frontmatter, field) => {
  expect(() => readPosts({ '../../posts/a.md': post(frontmatter) }, { drafts: false })).toThrow(
    field,
  );
});

test('rejects a file name that would make a poor address', () => {
  expect(() => readPosts({ '../../posts/My Post.md': post(valid) }, { drafts: false })).toThrow(
    'My Post.md',
  );
});

test('keeps a code block’s source for copying and colors it from the theme', async () => {
  const { nodes } = await parseMarkdown('```ts\nconst a = 1;\n```\n');
  const [tag, attributes] = nodes[0] ?? [];
  expect(tag).toBe('pre');
  expect(attributes).toMatchObject({ language: 'ts', code: 'const a = 1;' });
  expect(JSON.stringify(nodes)).toContain('color:var(--color-syntax-keyword)');
});
