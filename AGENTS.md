# Agents

Void's docs for the installed version are in `node_modules/void/docs/` inside each app. Read them before changing Void config or conventions.

- Server-only code goes in `src/server/`: anything that touches secrets, bindings or another service, or that must not reach the browser, like reading posts. A page gets its data from its `.server.ts` loader, typed with `InferProps`. Components go in `src/components/`, not `pages/`, even when only one page uses them.
- Islands can only be marked in a page or layout file, and an island import is `undefined` until the page renders, so use one only inside a component.
- Check data from outside (network responses, files like posts) with zod, and only the parts we use. Trust our own types.
- Imports are relative, because Void needs that for island imports.
- StyleX styles everything we render. `global.css` holds only what StyleX can't reach, like the spans rangi writes inside a code block. There are no inline `style` props, except the column alignment a Markdown table carries.
- Colors, type and focus come from Astryx's `colorVars`, `typographyVars` and `focusVars`, plus the site's `src/styles/tokens.stylex.ts`. Literal colors are only for drawings like the skyline. Both sites set font sizes in px: joeychilson on its pixel grid, turnscope to match the Mac app.
- Motion stops under `media.reducedMotion`.
- Animate a component's changes with CSS transitions, or `use-height-transition.ts` for heights. Don't use `<ViewTransition>` for this, because it snapshots the whole page.

Before you finish, run these from the repo root and commit any rebuilt theme files:

```sh
vp run -r theme
vp check
vp run -r test
vp run -r build
```
