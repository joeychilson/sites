# Conventions

How the code in this repo is organized and written. `vp check` enforces kebab-case file names, import order, the server-only boundary and the ban on `useId`; follow the rest by hand.

## Layout

Each site keeps [Void's project structure](https://void.cloud/reference/structure): Void's folders sit at the site's root, and `src/` holds everything else.

```
pages/            routes: pages, layouts, .server.ts files, Markdown
routes/           HTTP endpoints, such as feeds and redirects
middleware/       request middleware, run in file order (01.name.ts, 02.name.ts)
public/           static files, served as-is
src/
  components/     React components
  islands/        components that hydrate on island pages
  server/         code that only runs on the server
  styles/         global CSS, StyleX tokens, shared styles, the Astryx theme
  assets/         images and fonts that code imports
  *.ts            everything else: site data, formatting, parsing
```

- `pages/` holds route files only. Components go in `src/components/`, even when one page uses them.
- Code that touches secrets, bindings (`void/db`, `void/kv`, `void/storage`) or another service goes in `src/server/`. Only routes, middleware and `.server.ts` files may import it.
- When one area grows to many files, give it `src/features/<name>/` with the same folders inside, as Turnscope's `features/panel/` does.
- Move code into a shared package only once a second site needs it.

## Names

- Files and folders are kebab-case: `menu-bar-item.tsx`.
- One component per file, named after the file: `menu-bar-item.tsx` exports `MenuBarItem`. Hooks follow suit: `use-height-transition.ts` exports `useHeightTransition`.
- Props types are `<Component>Props`. Boolean props start with `is`, `has` or `should`, and event callbacks with `on`.
- Module constants are `UPPER_SNAKE_CASE` for fixed numbers and strings, and camelCase for data.
- Tests sit next to their module: `posts.ts`, `posts.test.ts`.

## Exports and imports

- A component file default-exports its component, and may also export the types its props use.
- Void's files export what Void reads: a default export from pages, layouts and middleware, `GET` or `POST` from routes, and `loader`, `action` or `head` from `.server.ts` files.
- Everything else uses named exports. There are no barrel `index.ts` files.
- Imports are relative. Void requires that for island imports, so everything follows.

## Inside a file

Imports, then types, constants and data, the exported component, its private components and helpers, and styles last. Comment only what the code can't say: a browser quirk, a constraint, where a number comes from.

## Styling

- StyleX styles everything we render. `className` is only a hook for markup we don't render, such as `.prose` around Markdown, and there are no inline `style` props.
- Colors, type and focus come from Astryx's tokens (`colorVars`, `typographyVars`, `focusVars`), and each site's own from `src/styles/tokens.stylex.ts`. Literal colors belong to drawings only, such as the skyline. The personal site sets type in px, on its pixel grid.
- `styles/global.css` holds only what StyleX can't reach: the reset and theme imports, fonts, `html` and `body`, the focus ring, view transitions and Markdown prose.
- After editing a theme in `src/styles/theme/`, run `pnpm --filter <site> theme` and commit the `built/` files. CI fails when they're out of date.
- Motion stops under `prefers-reduced-motion`, through `media.reducedMotion` in StyleX.

## React and data

- A page's data comes from the `loader` in its `.server.ts` file. Slow data uses `defer()`, read with `use()` inside `<Suspense>`.
- Validate input where it enters: routes, actions, responses from other services and Markdown frontmatter. Inside the app, trust the types.
- Animate a component's changes with CSS transitions, or the Web Animations API for heights (`use-height-transition.ts`). Don't use `<ViewTransition>` for this: it snapshots the whole page.
- Islands can't call `useId`. Each island hydrates as its own React root, so its ids won't match the server's HTML. Derive ids from props or data instead.

## Checks

Before you finish, run these from the repo root:

```sh
vp check
vp run -r test
vp run -r build
```
