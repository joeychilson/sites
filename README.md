# sites

The source for two websites.

| Site                                       | What it is                 | Source                                   |
| ------------------------------------------ | -------------------------- | ---------------------------------------- |
| [joeychilson.com](https://joeychilson.com) | Home page and writing      | [`sites/joeychilson`](sites/joeychilson) |
| [turnscope.app](https://turnscope.app)     | Landing page for Turnscope | [`sites/turnscope`](sites/turnscope)     |

## Stack

- [Void](https://void.cloud) for routing, rendering and deploys, on Cloudflare Workers
- [React](https://react.dev) 19
- [StyleX](https://stylexjs.com) for styles, with [Astryx](https://astryx.atmeta.com) themes and tokens
- [Comark](https://comark.dev) for posts, highlighted by [rangi](https://github.com/pi0/rangi), and [zod](https://zod.dev) for checking data from outside
- [Vite+](https://viteplus.dev) (`vp`) for the dev server, builds, formatting, linting and tests

## Development

You need Node.js 24.21 or later, pnpm and Vite+.

```sh
pnpm install
pnpm --filter joeychilson dev
pnpm --filter turnscope dev
```

Before you commit:

```sh
vp check        # format, lint and type-check
vp run -r test
vp run -r build
```

A pre-commit hook runs `vp check --fix` on staged files.

## Deployment

Merging to `main` deploys. CI runs the checks, then deploys each site whose files changed, or both when the shared dependencies did. It needs two repository secrets: `CLOUDFLARE_API_TOKEN`, from Cloudflare's Edit Cloudflare Workers template, and `CLOUDFLARE_ACCOUNT_ID`.

A new site is deployed once by hand from its folder, which creates its Cloudflare resources and attaches its domain:

```sh
pnpm void connect --platform cloudflare
pnpm void deploy
pnpm void domain add <hostname>
```

Commit the `void.lock.json` it updates. Server secrets are set with `pnpm void secret put <NAME>`.

## Layout

```
sites/joeychilson/          joeychilson.com
sites/turnscope/            turnscope.app
.github/workflows/ci.yml    checks and deploys
AGENTS.md                   instructions for coding agents
```

## License

[MIT](LICENSE)
