# slopgoblin.app

The website for [Slop Goblin](https://github.com/joeychilson/slopgoblin), a Chrome extension that hides AI slop, ragebait and other junk from your X feed. It shows the goblin at work on a feed, shows the side panel, says how to set it up, and links to install it.

The build prerenders the page. The Worker answers only 404s.

## Develop

From this folder:

```sh
pnpm dev     # http://localhost:5175
pnpm test    # the page and the 404
```

## Where things are

| Path                                | What it is                                                  |
| ----------------------------------- | ----------------------------------------------------------- |
| `src/routes/index.tsx`              | The page: the feed, the side panel, and setting it up       |
| `src/routes/__root.tsx`             | The document, the header and footer around it, and the 404  |
| `src/components/demo/live-feed.tsx` | The feed with the goblin peeking over it                    |
| `src/components/demo/feed.tsx`      | One post in the feed, and the bar it folds into             |
| `src/hooks/use-demo.ts`             | What the goblin has read so far, and what the reader let in |
| `src/lib/demo.ts`                   | The feed's made-up posts, and the rule for what's hidden    |
| `src/components/goblin.tsx`         | The goblin, drawn and moving as in the side panel           |
| `src/assets/panel-*.webp`           | The side panel, cropped from the extension's screenshots    |
| `src/styles/app.css`                | The side panel's colors, and the goblin's animations        |

## Keeping it in step with the extension

The page mirrors parts of the extension's repo:

- the side panel's colors, from `src/sidepanel/panel.css`;
- the goblin, from `src/sidepanel/Lurker.tsx`;
- the side panel pictures, from `.github/screenshots/`, cropped to the first four hidden posts;
- the bar a hidden post folds into, from `src/content/bar.ts`;
- the categories, from `src/core/taxonomy.ts`, and the rule for what's hidden, from `judge` in `src/core/policy.ts`;
- the cost and what's sent, from `README.md` and `PRIVACY.md`.
