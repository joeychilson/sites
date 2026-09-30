import { Marked } from 'marked';
import { createHighlighter } from 'shiki';
import * as v from 'valibot';
import { parse as parseYaml } from 'yaml';
import type { Post } from '#lib/posts.js';
import { day, night } from '#lib/server/code-theme.js';

type Entry = { post: Post; html: string };

const sources = {
  ...import.meta.glob<string>('/writing/*.md', { query: '?raw', import: 'default', eager: true }),
  // Sample posts, to see the list and a post in `bun run dev`. Never built.
  ...(import.meta.env.DEV
    ? import.meta.glob<string>('/writing/examples/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
      })
    : {}),
};

const DateField = v.pipe(
  v.string(),
  v.transform((value) => new Date(value)),
  v.check((date) => !Number.isNaN(date.getTime()), 'is not a date'),
);

const Frontmatter = v.pipe(
  v.object({
    title: v.pipe(v.string(), v.nonEmpty()),
    description: v.pipe(v.string(), v.nonEmpty()),
    date: DateField,
    updated: v.optional(DateField),
    draft: v.optional(v.boolean(), false),
  }),
  v.check((post) => !post.updated || post.updated >= post.date, '`updated` is before `date`'),
);

const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

/** Text made safe to put in HTML or XML. */
export const escape = (text: string) => text.replace(/[&<>"']/g, (char) => entities[char]);

let markdown: Promise<Marked> | undefined;

/** Markdown to HTML, with code highlighted: made once, when the first post is read. */
function getMarkdown() {
  return (markdown ??= createHighlighter({
    themes: [day, night],
    langs: [
      'bash',
      'css',
      'diff',
      'go',
      'html',
      'javascript',
      'json',
      'python',
      'rust',
      'sql',
      'svelte',
      'swift',
      'toml',
      'tsx',
      'typescript',
      'yaml',
    ],
  }).then(
    (shiki) =>
      new Marked({
        renderer: {
          // A code block names its language, and carries both themes' colors
          // for `app.css` to choose between by day and by night.
          code({ text, lang }) {
            const language = lang?.trim().split(/\s/)[0].toLowerCase();
            const known = !!language && shiki.getLoadedLanguages().includes(language);
            const html = shiki.codeToHtml(text, {
              lang: known ? language : 'text',
              themes: { light: day, dark: night },
              defaultColor: false,
            });
            const label = language ? `<figcaption>${escape(language)}</figcaption>` : '';
            return `<figure class="code">${label}${html}</figure>`;
          },
        },
      }),
  ));
}

/** Reads a post: its frontmatter, checked, and its Markdown as HTML. */
async function parsePost(slug: string, source: string): Promise<Entry> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) throw new Error(`writing/${slug}.md: starts without frontmatter`);
  const frontmatter = v.safeParse(Frontmatter, parseYaml(match[1]));
  if (!frontmatter.success)
    throw new Error(`writing/${slug}.md: ${v.summarize(frontmatter.issues)}`);
  return {
    post: { slug, ...frontmatter.output },
    html: (await getMarkdown()).parse(source.slice(match[0].length), { async: false }),
  };
}

let entries: Promise<Entry[]> | undefined;

function load() {
  return (entries ??= Promise.all(
    Object.entries(sources).map(([path, source]) =>
      parsePost(path.slice(path.lastIndexOf('/') + 1, -'.md'.length), source),
    ),
  ));
}

type Options = {
  /** Include drafts and posts dated in the future, as in development. */
  drafts?: boolean;
};

function visible(post: Post, { drafts = false }: Options) {
  return drafts || (!post.draft && post.date.getTime() <= Date.now());
}

/** Posts, newest first, without their HTML. */
export async function listPosts(options: Options = {}): Promise<Post[]> {
  return (await load())
    .map((entry) => entry.post)
    .filter((post) => visible(post, options))
    .sort((a, b) => b.date.getTime() - a.date.getTime() || a.slug.localeCompare(b.slug));
}

/** A post with its HTML. */
export async function findPost(slug: string, options: Options = {}) {
  const entry = (await load()).find((entry) => entry.post.slug === slug);
  return entry && visible(entry.post, options) ? { ...entry.post, html: entry.html } : undefined;
}
