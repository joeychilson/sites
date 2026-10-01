# turnscope.app

The landing page for [Turnscope](https://github.com/joeychilson/turnscope).

## Layout

Turnscope is a menu bar item, its panel, notifications and an MCP server, so the page is drawn as the top of a Mac: its header is the menu bar, clear over a desktop as macOS 26 draws it, and the panel hangs open from Turnscope's item in the system's glass. On a wide screen the panel floats, so a row opened in it lies over the page rather than pushing it down. The page keeps to the app's rule: gray until something needs you. The desktop's wallpaper is gray too, so the only colors on the page are a limit that won't last, in amber, one used up, in red, and a session at work right now, in green, the one color that asks nothing of you.

- `src/lib/site.ts`: name, description, links, and the command line agents start the server with.
- `src/app.css`: the app's colors (`macos/Turnscope/Style.swift` in the Turnscope repo) as Tailwind theme values, light and dark: the page's own, and macOS's label colors and popover glass for what the app draws. The shared utilities.
- `src/lib/components/Desktop.svelte`: a Mac's desktop, its wallpaper waves in grays, under the hero, the menu bar slices and the notifications.
- `src/lib/components/MenuBar.svelte`: the header, as a menu bar, with the item that opens and closes the panel, beside the system's own items and the clock.
- `src/lib/components/Panel.svelte`: the panel, drawn in HTML after `macos/Turnscope/Panel`, from the feed the app's own screenshots use (`contract/feed.json`), in the words `Words.swift` gives it. Its rows open as the app's do. `Turnscope --snapshot <dir> --fixture contract/feed.json --open account` draws the app's own to compare.
- `src/lib/components/Agents.svelte`: Settings' Agents tab, from the same feed, its Connect and Update working as the app's do.
- `src/lib/components/Level.svelte`: a limit's level, with what will be left at the reset and the mark for an even pace.
- `src/lib/components/Item.svelte`: what the menu bar item says of an account.
- `src/lib/components/Terminal.svelte`: a terminal window, for Claude Code's turns.
- `src/lib/components/Glyph.svelte`: the SF Symbols the page draws (the panel's gear, power, chevrons, lightbulb and checkmark; the menu bar's Wi-Fi, Spotlight and Control Center), exported from macOS as paths at the app's sizes and weights.
- `src/lib/assets/`: the app icon, rendered from `Turnscope.icon` with Icon Composer's `ictool`, light and dark.
- `static/social-card.png`: the 1200 × 630 sharing image, the hero at twice the size. Draw it again when the headline or the panel changes.

## Releases

The page is prerendered; `/download` is the one route that runs on each request. It redirects to the latest release's disk image, so the link follows new releases without a deploy. The release is read from GitHub and kept for 10 minutes. GitHub allows 60 calls an hour without a token, shared by everything behind the same address; set `GITHUB_TOKEN` on the service to raise that. If GitHub can't be reached, it redirects to the releases page.

## Good to know

- In `bun run dev`, Tailwind can miss classes in a file added while the server runs. Saving `src/app.css` picks them up. Builds aren't affected.
