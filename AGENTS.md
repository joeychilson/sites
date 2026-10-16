# Agents

Each app in `apps/` is a TanStack Start app on a Cloudflare Worker. TanStack Start's notes for the installed version are in `node_modules/@tanstack/react-start/skills/` inside each app, and Vite+'s docs in `node_modules/vite-plus/docs/` at the root. Read them before changing config or conventions.

- Pages are prerendered when the app builds and served as static files. The Worker answers only the rest: 404s, server functions, and server routes like turnscope's `/download`.
- `src/server.ts` is the Worker's entry. It adds the security headers to what the Worker answers, and `public/_headers` gives static files the same ones, so change both together.
- Server-only code goes in a `.server.ts` module in `src/lib/`: anything that touches secrets, bindings or another service, or that must not reach the browser, like reading posts. A page reaches it through a server function in a `.functions.ts` module, called from its loader. Components go in `src/components/` and hooks in `src/hooks/`, even when only one page uses them.
- Import from `src/` as `@/...`, even from the same folder. Only paths outside `src/`, like the posts glob, stay relative.
- Check data from outside (network responses, files like posts) with zod, and only the parts we use. Trust our own types.
- Tailwind styles everything we render, with classes in the markup. Each app's `src/styles/app.css` holds its `@theme`, its few `@utility` rules, and only what classes can't reach, like the HTML TanStack Markdown and TanStack Highlight write (joeychilson's `prose.css`). A `style` prop only carries a value worked out per element, like a measured position or a bar's width.
- Colors, type and easing come from the app's `@theme`, which clears Tailwind's palette. Literal colors are only for drawings like the skyline or turnscope's Mac screen. Both apps set font sizes in px: joeychilson on its pixel grid, turnscope to match the Mac app.
- Turnscope's mock of the app follows `macos/Turnscope/Style.swift` in the Turnscope repo: its colors, its one spring and its timings.
- Motion stops under reduced motion: `motion-safe:` or `motion-reduce:` on classes, a media query in CSS.
- Animate a component's changes with CSS transitions, or turnscope's `use-height-transition.ts` for heights. Don't use React's `<ViewTransition>` for this, because it snapshots the whole page. Navigating between pages, and joeychilson's day and night switch, use view transitions on purpose.
- `src/routeTree.gen.ts` is generated and committed. `vp dev`, `vp build` and `vp test` rewrite it, so run one after adding a route.
- Run apps with `vp dev` and `vp build`, never `cf dev` or `cf build`, which reach for plain Vite.

Before you finish, run this from the repo root. It generates binding types, builds both apps, then runs `vp check` and every test:

```sh
vp run ready
```
