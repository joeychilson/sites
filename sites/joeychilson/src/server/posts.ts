import { parseFrontmatter } from 'comark';
import * as z from 'zod';

import { site } from '../site';

const PostFile = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Name the file in lowercase words joined by hyphens'),
  frontmatter: z
    .strictObject({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      date: z.iso.date(),
      updated: z.iso.date().optional(),
      draft: z.boolean().default(false),
    })
    .refine(({ date, updated }) => updated === undefined || updated >= date, {
      path: ['updated'],
      message: 'Must not be before date',
    }),
});

type Post = z.output<typeof PostFile>['frontmatter'] & {
  slug: string;
  path: string;
  url: string;
  /** Names the post's title in the list and on its page, so it glides between them. */
  transitionName: string;
  /** The Markdown after the frontmatter. */
  body: string;
};

/** Every post newest first, leaving out drafts unless asked for them. */
export function readPosts(files: Record<string, string>, { drafts }: { drafts: boolean }) {
  return Object.entries(files)
    .map(([file, source]) => readPost(file, source))
    .filter((post) => drafts || !post.draft)
    .toSorted((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

function readPost(file: string, source: string): Post {
  const { data, content } = parseFrontmatter(source);
  const parsed = PostFile.safeParse({
    slug: file.slice(file.lastIndexOf('/') + 1, -'.md'.length),
    frontmatter: data,
  });
  if (!parsed.success) {
    throw new Error(`${file} isn't a valid post:\n${z.prettifyError(parsed.error)}`);
  }

  const { slug, frontmatter } = parsed.data;
  const path = `/writing/${slug}`;
  return {
    ...frontmatter,
    slug,
    path,
    url: new URL(path, site.url).href,
    transitionName: `post-${slug}`,
    body: content,
  };
}

// Only the dev server lists drafts, so a build never publishes one.
export const posts = readPosts(
  import.meta.glob<string>('../../posts/*.md', { eager: true, import: 'default', query: '?raw' }),
  { drafts: import.meta.env.DEV },
);

export function findPost(slug: string | undefined) {
  return posts.find((post) => post.slug === slug);
}
