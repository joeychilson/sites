# sites

Websites that aren't apps, one per folder under `sites/`, named after the domain.

| Site                                     | Domain          |
| ---------------------------------------- | --------------- |
| [`sites/joeychilson`](sites/joeychilson) | joeychilson.com |
| [`sites/turnscope`](sites/turnscope)     | turnscope.app   |

## Develop

Requires Bun (the version in `packageManager`).

```sh
bun install
cd sites/joeychilson && bun run dev
```

Run commands through `bun run`: adapter-bun only builds under Bun, and each `bunfig.toml` makes package binaries run on Bun.

| Command (from the root)         | What it does                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| `bun run check`                 | `vp check` (format, lint, types) on the whole repo, then `svelte-check` in each site |
| `bun run build`                 | Builds every site                                                                    |
| `bun run --filter <site> build` | Builds one site                                                                      |
| `bun sites/<site>/build`        | Serves a built site on `PORT` (default 3000)                                         |

A pre-commit hook runs `vp check --fix` on staged files. `bun install` sets it up.

## Dependencies

The root `catalog` in `package.json` pins the shared stack, and sites reference it with `"catalog:"`. Upgrading Svelte, SvelteKit, or Vite+ is one edit there.

## Deploy

Each site is a service in the Railway project `sites`, defined in [`.railway/railway.ts`](.railway/railway.ts).

- **Code:** Railway deploys a site on push to `main` when that site's watch paths change, once CI passes.
- **Infrastructure:** after editing `railway.ts`, run `railway config plan`, then `railway config apply`, from a directory linked to the project (`railway link`).
- **Custom domains:** Railway IaC can't register them. Add the domain to the service in the dashboard first, then add it to that service's `domains` in `railway.ts`.

## Add a site

1. Copy `sites/turnscope` to `sites/<domain name>` and change `name` in its `package.json`.
2. Add `site('<domain name>')` to `.railway/railway.ts`.
3. Run `bun install`, then `railway config apply`.
