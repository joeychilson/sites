<script lang="ts" module>
  // Line icons for the page's tiles, drawn for it on a 24-point grid with a
  // 1.6-point stroke: what each tile is about, at a glance.
  const icons = {
    // When it runs out
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    // Hours of work left
    hourglass: '<path d="M6 3h12M6 21h12M7.5 3c0 4.5 4.5 6 4.5 9s-4.5 4.5-4.5 9M16.5 3c0 4.5-4.5 6-4.5 9s4.5 4.5 4.5 9"/>',
    // What used it
    pie: '<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5a9 9 0 0 1 5.5 5.5H15z"/>',
    // Notifications
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 21h4"/>',
    // check_limits
    gauge: '<path d="M4.2 17.5a9 9 0 1 1 15.6 0"/><path d="m12 13 4-4"/><circle cx="12" cy="13" r="1"/>',
    // explain_usage
    bars: '<path d="M4 4v14a2 2 0 0 0 2 2h14"/><path d="M9 16v-4M13.5 16V8M18 16v-6"/>',
    // find_sessions
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    // handoff
    forward: '<path d="m15 6 5 5-5 5"/><path d="M20 11H10a6 6 0 0 0-6 6v2"/>',
    // read_session
    page: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    // continue
    play: '<circle cx="12" cy="12" r="9"/><path d="M10.5 8.75v6.5L15.5 12z"/>',
    // No secrets kept
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
    // No telemetry
    unseen: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 20 20 4"/>',
    // No account
    nobody: '<circle cx="10" cy="8" r="4"/><path d="M3 21a7 7 0 0 1 14 0"/><path d="m17 7 4 4M21 7l-4 4"/>',
  };

  export type IconName = keyof typeof icons;
</script>

<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  let { name, class: className }: { name: IconName; class?: ClassValue } = $props();
</script>

<svg
  class={className}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.6"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- the page's own drawings -->
  {@html icons[name]}
</svg>
