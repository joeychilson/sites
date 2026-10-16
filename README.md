# sites

The source for two websites.

| Site                                       | What it is                 | Source                                 |
| ------------------------------------------ | -------------------------- | -------------------------------------- |
| [joeychilson.com](https://joeychilson.com) | Home page and writing      | [`apps/joeychilson`](apps/joeychilson) |
| [turnscope.app](https://turnscope.app)     | Landing page for Turnscope | [`apps/turnscope`](apps/turnscope)     |

## Stack

- [TanStack Start](https://tanstack.com/start) and [TanStack Router](https://tanstack.com/router) on React 19, prerendered and served by Cloudflare Workers
- [TanStack Markdown](https://tanstack.com/markdown) and [TanStack Highlight](https://tanstack.com/highlight) for posts
- [Tailwind CSS](https://tailwindcss.com) 4
- [zod](https://zod.dev) for checking data from outside
- [Vite+](https://viteplus.dev) (`vp`) for the dev server, builds, formatting, linting, tests and tasks
- The [`cf`](https://developers.cloudflare.com/cf/) CLI and the Cloudflare Vite plugin, with each Worker declared in its app's `cloudflare.config.ts`

## Development

You need Node.js 24.22 or later, pnpm and Vite+.

```sh
pnpm install
pnpm --filter joeychilson dev   # http://localhost:5173
pnpm --filter turnscope dev     # http://localhost:5174
```

Before you commit:

```sh
vp run ready    # types, builds, then format, lint, type-check and tests
```

A pre-commit hook runs `vp check --fix` on staged files.

## Deployment

Merging to `main` deploys. CI runs the checks, then builds and deploys each app the push changed. It needs two repository secrets: `CLOUDFLARE_API_TOKEN`, from Cloudflare's Edit Cloudflare Workers template, and `CLOUDFLARE_ACCOUNT_ID`.

An app's Worker, and the custom domain in its `cloudflare.config.ts`, are created on its first deploy. turnscope.app's Worker requires one secret, a GitHub token for reading its releases, so set it before that deploy:

```sh
npx wrangler secret put GITHUB_TOKEN --name turnscope
```

joeychilson.dev is on the joeychilson Worker so it keeps its DNS record, and a Cloudflare Redirect Rule, outside this repo, sends it to joeychilson.com before the Worker sees it.

## Layout

```
apps/joeychilson/           joeychilson.com
apps/turnscope/             turnscope.app
.github/workflows/ci.yml    checks and deploys
AGENTS.md                   instructions for coding agents
```

## License

[MIT](LICENSE)
