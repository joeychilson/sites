# joeychilson.com

My personal site.

## Layout

- `src/lib/site.ts`: name, links and projects.
- `src/app.css`: colors, type (Inter, with [Departure Mono](https://departuremono.com) for the pixel lettering), and how posts are set.
- `src/lib/theme.svelte.ts`: day and night. `src/app.html` applies a saved choice before the first paint, and `vite.config.ts` allows that script by its hash.
- `writing/`: posts, in Markdown.
- `writing/examples/`: sample posts that show only in `bun run dev`, to see the list and a post.
- `static/social-card.png`: the 1200 × 630 sharing image: my name over the city at night.

## Writing

Add a file such as `writing/first-post.md`:

```md
---
title: A small observation
description: One line for search results and RSS.
date: 2026-10-01
---

Write here.
```

- The file's name is its address: this one is `/writing/first-post`.
- Add `draft: true` to keep a post out of the build, the feed and the sitemap. Drafts, and posts dated in the future, still show in `bun run dev`.
- A post dated in the future appears with the first build on or after its date.
- `updated: 2026-10-05` marks a revision.
- Code blocks are highlighted at build time, in the page's own colors.
