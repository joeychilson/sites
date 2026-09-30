# turnscope.app

The landing page for [Turnscope](https://github.com/joeychilson/turnscope).

## Layout

Turnscope is a menu bar item, its panel, notifications and an MCP server, so the page is drawn as the top of a Mac: its header is the menu bar, and the panel hangs open from Turnscope's item. The page keeps to the app's rule: gray until something needs you. The only color on it is a limit that won't last, in amber, and one used up, in red.

- `src/lib/site.ts`: name, description, links, and the command line agents start the server with.
- `src/app.css`: the app's colors (`macos/Turnscope/Style.swift` in the Turnscope repo) as Tailwind theme values, light and dark, and the shared utilities.
- `src/lib/components/MenuBar.svelte`: the header, as a menu bar, with the item that opens and closes the panel.
- `src/lib/components/Panel.svelte`: the panel, drawn in HTML after `macos/Turnscope/Panel`, from the feed the app's own screenshots use (`contract/feed.json`). Its rows open as the app's do.
- `src/lib/components/Item.svelte`: what the menu bar item says of an account.
- `src/lib/components/Glyph.svelte`: the SF Symbols the panel draws (gear, power, chevron, lightbulb), exported from macOS as paths at the app's sizes and weights.
- `src/lib/assets/`: the app icon, rendered from `Turnscope.icon` with Icon Composer's `ictool`, light and dark.
- `static/social-card.png`: the 1200 × 630 sharing image, the hero at twice the size. Draw it again when the headline or the panel changes.

## Releases

The page is prerendered; `/download` is the one route that runs on each request. It redirects to the latest release's disk image, so the link follows new releases without a deploy. The release is read from GitHub and kept for 10 minutes. GitHub allows 60 calls an hour without a token, shared by everything behind the same address; set `GITHUB_TOKEN` on the service to raise that. If GitHub can't be reached, it redirects to the releases page.

## Good to know

- In `bun run dev`, Tailwind can miss classes in a file added while the server runs. Saving `src/app.css` picks them up. Builds aren't affected.
