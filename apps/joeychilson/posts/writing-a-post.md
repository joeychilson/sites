---
title: Writing a post
description: Everything a post on this site can hold, written the way it's written.
date: 2026-10-20
draft: true
---

A post is a Markdown file in `posts/`, named for its address: this one is `posts/writing-a-post.md`, so it lives at `/writing/writing-a-post`. Text can be **strong**, _emphasized_, ~~struck out~~ or `code`, and [links](https://joeychilson.com) look like this.[^1]

## Headings

A post's title is its only first-level heading, so sections start at two hashes. Each heading gets an address, and hovering it shows a `#` to link to it.

### A smaller heading

Third- and fourth-level headings step back in gray.

#### Smaller still

For when a section needs parts.

## Lists

- An item
- An item with more under it
  - A nested item
  - Another one
- A last item

1. Ordered items count themselves
2. Even when the numbers in the file don't match
3. Like these

- [x] A task that's done
- [ ] A task that isn't

## Quotes and alerts

> A quote is set in from the text and quieted, for words that are someone else's.
>
> It can run to more than one paragraph.

> [!NOTE]
> A note, for something worth knowing along the way.

> [!TIP]
> A tip, for a better way to do something.

> [!IMPORTANT]
> Something a reader shouldn't miss.

> [!WARNING]
> Something that could go wrong.

> [!CAUTION]
> Something that will go wrong.

## Code

A fence names its language, and `file="…"` after it names a file in its place. Numbers in braces mark lines.

```ts file="src/hello.ts" {2}
export function hello(name: string): string {
  return `Hello, ${name}`;
}
```

```sh
pnpm dev
```

```diff
- const greeting = 'Hello';
+ const greeting = 'Hello, world';
```

```
A fence without a language is plain text.
```

## Tables

| Fence  | Shows           | Lines |
| :----- | :-------------- | ----: |
| `ts`   | TypeScript      |     3 |
| `sh`   | A shell command |     1 |
| `diff` | A change        |     2 |

## Images

Images in `public/` are written from the site's root. They load as they scroll into view.

![Joey Chilson, above a pixel city at night.](/social-card.png)

---

A rule like the one above breaks a post into parts.[^2]

[^1]: Footnotes gather at the end, each with a link back to where it was cited.

[^2]: The arrow beside a footnote returns to the text.
