---
title: What I learned building a menu bar app in Rust
description: A sample post, to see how writing looks. Only in development.
date: 2026-09-18
---

A sample post, here to see how writing looks. It isn't built, so it never reaches the site. It has a [link](https://turnscope.app), some _italics_ and **bold**, and `inline code`.

## Drawing the panel

The panel is drawn with GPUI, the same way the main window is. A few things mattered more than expected:

- Every row keeps a fixed height, so the list never jumps.
- Numbers use tabular figures, so they line up as they change.
- The panel opens beneath its item, the way the system's own menus do.

> Make it fast first, then make it pretty. Nobody waits for pretty.

```rust
use std::time::Duration;

/// Every row is one line, laid out once.
pub fn lay_out(rows: &[Row], width: f32) -> Vec<Line> {
    let mut lines = Vec::with_capacity(rows.len());
    for row in rows.iter().filter(|r| r.visible) {
        lines.push(Line::new(row.title.clone(), width - 24.0));
    }
    lines
}
```

The site that shows it is SvelteKit:

```ts
// The latest release, kept for ten minutes.
export async function latestRelease(): Promise<Release> {
  const response = await fetch(API, { signal: AbortSignal.timeout(4000) });
  if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
  return { version: body.tag_name.replace(/^v/, ''), cached: true };
}
```

```svelte
<script lang="ts">
  let { name = 'world' } = $props();
</script>

<h1 class="title">Hello {name}!</h1>
```

```bash
brew install --cask joeychilson/tap/turnscope
turnscope doctor --strict
```

---

### Next

A last paragraph after the break, long enough to wrap onto a second line so the measure and the leading can be judged together.
