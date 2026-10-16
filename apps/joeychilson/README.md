# joeychilson.com

Joey Chilson's home page: profiles, projects and writing, under a pixel city that turns from day to night.

The build prerenders every page, the RSS feed and the sitemap. After the first page, links load the next one in place, so the city keeps running, and hovering a link loads its page ahead of the click. Clicking the skyline switches between day and night.

## Develop

From this folder:

```sh
pnpm dev     # http://localhost:5173
pnpm test    # posts' frontmatter, and every page and feed
```

## Where things are

| Path                                          | What it is                                                       |
| --------------------------------------------- | ---------------------------------------------------------------- |
| `posts/`                                      | Posts, one Markdown file each                                    |
| `src/routes/__root.tsx`                       | The document, the skyline and name above every page, and the 404 |
| `src/routes/index.tsx`                        | The home page: links, projects and the list of posts             |
| `src/routes/writing/$slug.tsx`                | A post                                                           |
| `src/routes/rss[.]xml.ts`, `sitemap[.]xml.ts` | The feed and the sitemap                                         |
| `src/lib/posts.server.ts`                     | Reads posts, checks their frontmatter with zod, highlights code  |
| `src/components/post-body.tsx`                | Draws a post's Markdown in the site's style                      |
| `src/components/skyline.tsx`                  | The pixel city and the day and night switch                      |
| `src/styles/app.css`, `prose.css`             | The theme, and the styles for what Markdown writes               |

## Write a post

Add `posts/<slug>.md`. The file's name is the post's address, `/writing/<slug>`, in lowercase words joined by hyphens.

```md
---
title: The post's title
description: One sentence for the list, the feed and search results.
date: 2026-10-25
draft: true
---

The post, in Markdown.
```

A draft shows only on the dev server, marked as one. Delete `draft: true` to publish it with the next deploy. Add `updated: YYYY-MM-DD` when a post is revised.

[`posts/writing-a-post.md`](posts/writing-a-post.md) is a draft that shows everything a post can hold: headings, lists and task lists, quotes, alerts (`> [!NOTE]`), code with a file name and marked lines, tables, images, rules and footnotes. Run `pnpm dev` and open `/writing/writing-a-post` to see it.

`pnpm test` fails on a post with a missing or misspelled field, a date that isn't on the calendar, or an `updated` date before its `date`.

## Theme

`src/styles/app.css`: near-black on white by day, the other way around by night, with code in the city's colors. The site follows the system setting. Clicking the skyline switches it, and a choice that differs from the system is remembered.
