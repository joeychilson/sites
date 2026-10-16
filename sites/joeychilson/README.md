# joeychilson.com

Joey Chilson's home page: profiles, projects and writing, under a pixel city that goes from day to night.

Every page is prerendered HTML, and posts are written in Markdown. Only three small parts load JavaScript: the skyline, which switches between day and night when you click it; the highlight that glides between rows in a list; and the button that copies a code block. A Worker serves the RSS feed and the sitemap.

## Develop

From this folder:

```sh
pnpm dev
pnpm test    # also checks every post's frontmatter
```

## Where things are

| Path                                         | What it is                                                 |
| -------------------------------------------- | ---------------------------------------------------------- |
| `posts/`                                     | Posts, one Markdown file each                              |
| `pages/index.island.tsx`                     | The home page: links, projects and the list of posts       |
| `pages/writing/[slug].island.tsx`            | A post, with its loader, head and prerendered paths beside |
| `pages/layout.island.tsx`                    | The skyline and name above every page                      |
| `src/server/posts.ts`                        | Reads posts and checks their frontmatter with zod          |
| `src/server/markdown.ts`                     | Parses a post with Comark and highlights its code          |
| `src/components/prose.tsx`                   | Draws each Markdown element in the site's style            |
| `src/components/skyline.tsx`                 | The pixel city and the day and night switch                |
| `routes/rss.xml.ts`, `routes/sitemap.xml.ts` | The feed and the sitemap                                   |

## Write a post

Add `posts/<slug>.md`. The file's name is the post's address, `/writing/<slug>`, in lowercase words joined by hyphens.

```md
---
title: The post's title
description: One sentence for the list, the feed and search results.
date: 2026-10-20
draft: true
---

The post, in Markdown.
```

A draft shows only on the dev server, marked as one. Delete `draft: true` to publish it with the next deploy. Add `updated: YYYY-MM-DD` when a post is revised.

[`posts/writing-a-post.md`](posts/writing-a-post.md) is a draft that shows everything a post can hold: headings, lists and task lists, quotes, alerts (`> [!NOTE]`), code with a file name and marked lines, tables, images, rules and footnotes. `pnpm dev` and open `/writing/writing-a-post` to see it.

`pnpm test` fails on a post with a missing or misspelled field, a date that isn't on the calendar, or an `updated` date before its `date`.

## Theme

`src/styles/theme/city.ts`: near-black on white by day, the other way around by night, with code in the city's colors. The site follows the system setting. Clicking the skyline switches it, and a choice that differs from the system is remembered. After editing the theme, run `pnpm theme` and commit `src/styles/theme/built/`.

## Deploy

From this folder, `pnpm void deploy`. To serve it at joeychilson.com, run `pnpm void domain add joeychilson.com`. It needs no secrets.
