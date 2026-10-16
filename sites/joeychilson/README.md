# joeychilson.com

Joey Chilson's home page and writing. Every page is prerendered HTML. Two islands hydrate in the browser: the skyline, which also switches between day and night, and the highlight that glides over list rows. The Worker serves the RSS feed and the sitemap.

## Develop

From this folder:

```sh
pnpm dev
pnpm test    # includes a check of every post's frontmatter
```

## Where things are

| Path                                         | What it is                                           |
| -------------------------------------------- | ---------------------------------------------------- |
| `pages/index.island.tsx`                     | The home page: links, projects and the list of posts |
| `pages/layout.island.tsx`                    | The skyline and name above every page                |
| `pages/writing/`                             | Posts as Markdown, and the layout around them        |
| `src/posts.ts`                               | Reads and checks post frontmatter                    |
| `src/islands/skyline.tsx`                    | The pixel city and the day and night switch          |
| `src/islands/rows.tsx`                       | List rows with the gliding highlight                 |
| `routes/rss.xml.ts`, `routes/sitemap.xml.ts` | The feed and the sitemap                             |

## Write a post

Add `pages/writing/<slug>.md`:

```md
---
title: The post's title
description: One sentence for the list, the feed and search results.
date: 2026-10-20
---

The post, in Markdown.
```

Add `updated: YYYY-MM-DD` when you revise it. A post goes live when it's merged to `main` and deployed, so keep drafts on a branch. `pnpm test` fails on bad frontmatter.

## Theme

`src/styles/theme/city.ts`: near-black on white by day, the other way around by night. The site follows the system setting. Clicking the skyline switches it, and a choice that differs from the system is remembered. After editing the theme, run `pnpm theme` and commit `src/styles/theme/built/`.

## Deploy

From this folder, `pnpm void deploy`. To serve it at joeychilson.com, run `pnpm void domain add joeychilson.com`. It needs no secrets.
