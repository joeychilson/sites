import pages, { type VoidMdPage } from '@void/md/pages';

export type Post = {
  path: string;
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string | null;
};

export function toPosts(source: ReadonlyArray<VoidMdPage>): Array<Post> {
  return source
    .filter((page) => page.path.startsWith('/writing/'))
    .map(toPost)
    .sort((a, b) => b.published.localeCompare(a.published) || a.path.localeCompare(b.path));
}

function toPost({ path, frontmatter }: VoidMdPage): Post {
  const { title, description, date, updated } = frontmatter;
  const problem = (message: string) => new Error(`pages${path}.md ${message}`);

  if (typeof title !== 'string' || !title.trim()) throw problem('needs a title.');
  if (typeof description !== 'string' || !description.trim()) throw problem('needs a description.');
  const published = toDay(date);
  if (!published) throw problem('needs a date as YYYY-MM-DD.');
  const updatedDay = toDay(updated);
  if (updated !== undefined && !updatedDay) throw problem('needs its updated date as YYYY-MM-DD.');
  if (updatedDay && updatedDay < published) throw problem('has an updated date before its date.');

  return {
    path,
    slug: path.slice('/writing/'.length),
    title,
    description,
    published,
    updated: updatedDay,
  };
}

/** Reads a frontmatter date as YYYY-MM-DD, or null when it isn't a day. */
function toDay(value: unknown): string | null {
  // YAML reads an unquoted date as a timestamp at midnight UTC, and a quoted one as text.
  const day =
    typeof value === 'string' ? /^(\d{4}-\d{2}-\d{2})(T00:00:00\.000Z)?$/.exec(value)?.[1] : null;
  if (!day) return null;
  // Date moves a day that doesn't exist, such as 02-31, into the next month, so it won't read back.
  // This only catches a quoted date: YAML has already moved an unquoted one.
  const date = new Date(day);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(day) ? day : null;
}

export const posts = toPosts(pages);
