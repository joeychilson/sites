# turnscope.app

The website for [Turnscope](https://github.com/joeychilson/turnscope), a free Mac menu bar app that shows what's left of your coding agents' usage limits and whether they'll last until they reset. It explains the app, lets you try a working copy of its panel, and links to the latest release.

The page is prerendered HTML. Only what you can use loads JavaScript: the Mac screen at the top, where the panel opens and closes, and the commands you can copy. A Worker serves `/download`, which sends you to the newest disk image on GitHub.

## Develop

From this folder:

```sh
pnpm dev
pnpm test    # the /download link
```

## Where things are

| Path                                          | What it is                                                    |
| --------------------------------------------- | ------------------------------------------------------------- |
| `pages/index.island.tsx`                      | The page, section by section                                  |
| `pages/layout.island.tsx`                     | The header and footer around it                               |
| `src/content.ts`                              | The page's lists: agents, providers, tools, commands, privacy |
| `src/demo.ts`                                 | What the mock of the app shows                                |
| `src/components/`                             | The page's parts, including the islands named above           |
| `src/components/panel/`                       | A working copy of the app's panel, with its sizes and spring  |
| `routes/download.ts`, `src/server/release.ts` | The `/download` redirect                                      |

## Download link

`/download` redirects to the latest GitHub release's `.dmg`, or to the release's page when it has none. GitHub's answer is checked with zod, and only links on github.com pass. The address is cached in KV for 10 minutes. When GitHub can't be read, the releases page stands in for a minute before the next try. If KV fails, the link still works, without the cache.

GitHub allows 60 unauthenticated requests an hour. To raise that, set a token: `pnpm void secret put GITHUB_TOKEN`.

## Theme

`src/styles/theme/turnscope.ts`: dark only, in the colors of the app's dark mode. After editing it, run `pnpm theme` and commit `src/styles/theme/built/`.

## Deploy

From this folder, `pnpm void deploy`. To serve it at turnscope.app, run `pnpm void domain add turnscope.app`. `GITHUB_TOKEN` is optional.
