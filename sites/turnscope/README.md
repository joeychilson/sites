# turnscope.app

The landing page for [Turnscope](https://github.com/joeychilson/turnscope).

## Files

- `src/routes/+page.svelte`: the page and its copy.
- `src/routes/+error.svelte`: the error page.
- `src/routes/download/+server.ts`: redirects to the latest release's disk image.
- `src/lib/site.ts`: the name, description, links, and the path of the app's command line.
- `src/app.css`: colors and shared styles. Colors match the app's dark mode (`macos/Turnscope/Style.swift` in the Turnscope repo).
- `src/lib/components/MacScreen.svelte`: a Mac screen with a menu bar, drawn at 1120 × 640 and scaled to fit. On phones it shows only the panel.
- `src/lib/components/Panel.svelte`: the app's panel in HTML, showing `contract/status.notification.json` in the words the app gives it, with Claude Max open. To compare with the app, run `Turnscope --snapshot <dir> --fixture contract/status.notification.json --open account` from the Turnscope repo.
- `src/lib/components/Icon.svelte`: the line icons on the page's tiles, drawn for it.
- `src/lib/components/`: the rest are the header, footer, terminal window, limit bar, menu bar item, the app's symbols (`Glyph.svelte`), logos, copyable command and tabs.
- `static/social-card.png`: the 1200 × 630 sharing image: the headline, a line under it, and the first screen's Mac screen. Redraw it when the headline or the first screen changes, from a temporary route that shows them, with headless Chrome at `--window-size=800,420 --force-device-scale-factor=1.5`.

## Releases

The page is prerendered. `/download` runs on each request. It reads the latest release from GitHub, keeps it for 10 minutes, and redirects to its disk image, so new releases need no deploy. Without a token GitHub allows 60 calls an hour per address; set `GITHUB_TOKEN` on the service to raise that. If GitHub can't be reached, it redirects to the releases page.

## Good to know

- In `bun run dev`, Tailwind can miss classes in a file added while the server runs. Saving `src/app.css` picks them up. Builds aren't affected.
