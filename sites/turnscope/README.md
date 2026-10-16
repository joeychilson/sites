# turnscope.app

The landing page for [Turnscope](https://github.com/joeychilson/turnscope), a Mac menu bar app that tracks coding agents' usage limits, and the `/download` link to its latest release. The page is prerendered HTML, and only its interactive parts hydrate in the browser: the hero's Mac screen and the commands you can copy. The Worker serves `/download`.

## Develop

From this folder:

```sh
pnpm dev
pnpm test    # the /download link
```

## Where things are

| Path                                          | What it is                                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `pages/index.island.tsx`                      | The page, with its copy and data                                                               |
| `pages/layout.island.tsx`                     | The header and footer around it                                                                |
| `src/components/`                             | The page's static parts                                                                        |
| `src/islands/`                                | The parts that hydrate: the hero's screen and the commands you can copy                        |
| `src/features/panel/`                         | The hero's Mac screen, and a working copy of the app's panel with its sizes, colors and spring |
| `routes/download.ts`, `src/server/release.ts` | The `/download` redirect                                                                       |

## Download link

`/download` redirects to the latest GitHub release's `.dmg`, or to the release page when it has none. The address is cached in KV for 10 minutes. When GitHub can't be read, the releases page stands in for a minute before the next try. If KV fails, the link still works, without the cache.

GitHub allows 60 unauthenticated requests an hour. To raise that, set a token: `pnpm void secret put GITHUB_TOKEN`.

## Theme

`src/styles/theme/turnscope.ts`: dark only, in the colors of the app's dark mode. After editing it, run `pnpm theme` and commit `src/styles/theme/built/`.

## Deploy

From this folder, `pnpm void deploy`. To serve it at turnscope.app, run `pnpm void domain add turnscope.app`. `GITHUB_TOKEN` is optional.
