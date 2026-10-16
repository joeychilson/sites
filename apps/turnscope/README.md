# turnscope.app

The website for [Turnscope](https://github.com/joeychilson/turnscope), a free Mac menu bar app that shows what's left of your coding agents' usage limits and whether they'll last until they reset. It explains the app, lets you try a working copy of its panel, and links to the latest release.

The build prerenders the page. The Worker serves `/download`, which sends you to the newest disk image on GitHub.

## Develop

From this folder:

```sh
pnpm dev     # http://localhost:5174
pnpm test    # the page, the 404 and the /download link
```

## Where things are

| Path                                                  | What it is                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| `src/routes/index.tsx`                                | The page, section by section                                  |
| `src/routes/__root.tsx`                               | The document, the header and footer around it, and the 404    |
| `src/lib/content.ts`                                  | The page's lists: agents, providers, tools, commands, privacy |
| `src/lib/demo.ts`                                     | What the mock of the app shows                                |
| `src/components/`                                     | The page's parts                                              |
| `src/components/hero-screen.tsx`                      | The Mac screen at the top                                     |
| `src/components/panel/`                               | A working copy of the app's panel, with its sizes and spring  |
| `src/routes/download.ts`, `src/lib/release.server.ts` | The `/download` redirect                                      |
| `src/styles/app.css`                                  | The theme, in the colors of the app's dark mode               |

## Download link

`/download` redirects to the latest GitHub release's `.dmg`, or to the release's page when it has none. GitHub's answer is checked with zod, and only links on github.com pass. Each data center caches the address for 10 minutes. When GitHub can't be read, the releases page stands in for a minute before the next try.

The deployed Worker reads GitHub with the `GITHUB_TOKEN` secret, since GitHub allows few requests without one. The dev server doesn't need it.
