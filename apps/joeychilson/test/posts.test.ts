import { describe, expect, it } from 'vite-plus/test';

import { listPosts, parsePost } from '@/lib/posts.server';

const fields = 'title: Hello\ndescription: A first post.\ndate: 2026-10-20';
const source = (frontmatter: string, body = 'Some text.') =>
  `---\n${frontmatter}\n---\n\n${body}\n`;

describe('parsePost', () => {
  it('reads the frontmatter', () => {
    expect(parsePost('hello', source(`${fields}\nupdated: 2026-10-22`))).toMatchObject({
      slug: 'hello',
      title: 'Hello',
      description: 'A first post.',
      date: '2026-10-20',
      updated: '2026-10-22',
      isDraft: false,
    });
    expect(parsePost('hello', source(`${fields}\ndraft: true`)).isDraft).toBe(true);
  });

  it.each([
    ['a missing field', 'title: Hello\ndate: 2026-10-20', 'description'],
    ['a misspelled field', `${fields}\ndraf: true`, 'draf'],
    [
      'a date not on the calendar',
      'title: Hello\ndescription: A first post.\ndate: 2026-02-30',
      'date',
    ],
    ['an update before the date', `${fields}\nupdated: 2026-10-19`, 'updated is before date'],
  ])('rejects %s', (_, frontmatter, message) => {
    expect(() => parsePost('hello', source(frontmatter))).toThrow(message);
  });

  it('rejects a file name that is not a slug', () => {
    expect(() => parsePost('Hello_World', source(fields))).toThrow(
      'Hello_World.md: name a post in lowercase words joined by hyphens',
    );
  });

  it('highlights code into finished markup', () => {
    const { body } = parsePost('hello', source(fields, '```ts file="a.ts"\nconst a = 1;\n```'));
    expect(body.children).toContainEqual(
      expect.objectContaining({
        type: 'component',
        name: 'code-block',
        properties: expect.objectContaining({
          label: 'a.ts',
          code: 'const a = 1;',
          html: expect.stringContaining('th-keyword'),
        }),
      }),
    );
  });
});

describe('listPosts', () => {
  it('includes every post, newest first', () => {
    const posts = listPosts();
    expect(posts).toHaveLength(Object.keys(import.meta.glob('../posts/*.md')).length);
    expect(posts.map((post) => post.date)).toEqual(
      posts
        .map((post) => post.date)
        .toSorted()
        .toReversed(),
    );
  });
});
