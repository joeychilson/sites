import { createHighlighter } from '@tanstack/highlight/core';
import * as languages from '@tanstack/highlight/languages';
import { renderCodeFence } from '@tanstack/highlight/markdown';
import type { BlockNode, MarkdownExtension } from '@tanstack/markdown';
import { calloutsExtension } from '@tanstack/markdown/extensions/callouts';
import { parseMarkdown } from '@tanstack/markdown/parser';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const Frontmatter = z
  .strictObject({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    date: z.iso.date(),
    updated: z.iso.date().optional(),
    draft: z.boolean().optional(),
  })
  .refine((post) => !post.updated || post.updated >= post.date, {
    message: 'updated is before date',
    path: ['updated'],
  });

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const highlighter = createHighlighter({ languages: Object.values(languages) });

// Highlighting here keeps the highlighter out of the browser: pages get finished markup.
const codeBlocks: MarkdownExtension = {
  name: 'code-blocks',
  transformDocument: (document) => ({ ...document, children: document.children.map(highlight) }),
};

function highlight(node: BlockNode): BlockNode {
  switch (node.type) {
    case 'code': {
      const block = renderCodeFence(
        { code: node.value, lang: node.lang, meta: node.meta },
        highlighter,
      );
      return {
        type: 'component',
        name: 'code-block',
        tagName: 'code-block',
        attributes: {},
        properties: {
          html: block.htmlMarkup,
          code: block.copyText,
          label: block.title ?? node.lang ?? '',
        },
        children: [],
      };
    }
    case 'blockquote':
    case 'callout':
    case 'component':
      return highlightChildren(node);
    case 'list':
      return { ...node, items: node.items.map(highlightChildren) };
    case 'footnotes':
      return { ...node, items: node.items.map(highlightChildren) };
    default:
      return node;
  }
}

function highlightChildren<T extends { children: BlockNode[] }>(node: T): T {
  return { ...node, children: node.children.map(highlight) };
}

export function parsePost(slug: string, source: string) {
  if (!slugPattern.test(slug)) {
    throw new Error(`${slug}.md: name a post in lowercase words joined by hyphens`);
  }
  const body = parseMarkdown(source, { extensions: [calloutsExtension(), codeBlocks] });
  const frontmatter = Frontmatter.safeParse(parseYaml(body.frontmatter ?? ''));
  if (!frontmatter.success) {
    throw new Error(`${slug}.md: ${z.prettifyError(frontmatter.error)}`);
  }
  const { draft, ...fields } = frontmatter.data;
  return { slug, ...fields, isDraft: draft === true, body };
}

const sources = import.meta.glob<string>('../../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const posts = Object.entries(sources)
  .map(([path, source]) => parsePost(path.slice(path.lastIndexOf('/') + 1, -'.md'.length), source))
  .filter((post) => import.meta.env.DEV || !post.isDraft)
  .toSorted((a, b) => b.date.localeCompare(a.date));

export function listPosts() {
  return posts.map(({ body: _body, ...summary }) => summary);
}

export function findPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
