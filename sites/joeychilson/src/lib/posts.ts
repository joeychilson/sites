export type Post = {
  /** From the file's name: `writing/first-post.md` is `first-post`. */
  slug: string;
  title: string;
  description: string;
  date: Date;
  updated?: Date;
  draft: boolean;
};

export function postPath(slug: string) {
  return `/writing/${encodeURIComponent(slug)}`;
}

// Dates are written without a time, so they're read, and shown, as UTC.
const day = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' });
const month = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "Sep 18, 2026" */
export const formatDate = (date: Date) => day.format(date);

/** "Sep 2026" */
export const formatMonth = (date: Date) => month.format(date);
