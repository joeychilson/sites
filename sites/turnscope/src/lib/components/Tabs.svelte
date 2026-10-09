<script lang="ts" generics="T extends { value: string; label: string }">
  import type { Snippet } from 'svelte';

  let {
    label,
    options,
    value = $bindable(),
    panel,
  }: {
    label: string;
    options: readonly T[];
    value: T['value'];
    /** What an option shows while it's chosen. */
    panel: Snippet<[T]>;
  } = $props();

  const id = $props.id();
  const tabs: HTMLButtonElement[] = [];

  // Arrow keys move between tabs, wrapping around; Home and End go to the ends.
  function onkeydown(event: KeyboardEvent, index: number) {
    const count = options.length;
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + count) % count;
    value = options[next].value;
    tabs[next].focus();
  }
</script>

<!-- On a phone, a pop-up button in place of tabs too many to fit. -->
<span class="relative inline-flex sm:hidden">
  <select
    aria-label={label}
    class="h-9 cursor-default appearance-none rounded-full bg-fill pr-9 pl-4 text-[15px] text-ink"
    bind:value
  >
    {#each options as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  <svg
    class="pointer-events-none absolute top-1/2 right-3.5 size-3 -translate-y-1/2 text-ink-2"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"><path d="m3.5 4.5 2.5-2.5 2.5 2.5M3.5 7.5 6 10l2.5-2.5" /></svg
  >
</span>

<!-- A segmented control: a track with a raised thumb on the choice. -->
<div
  role="tablist"
  aria-label={label}
  class="hidden max-w-full gap-0.5 overflow-x-auto rounded-full bg-fill p-[3px] [scrollbar-width:none] sm:inline-flex"
>
  {#each options as option, index (option.value)}
    {@const selected = option.value === value}
    <button
      type="button"
      role="tab"
      bind:this={tabs[index]}
      id="{id}-tab-{option.value}"
      aria-selected={selected}
      aria-controls="{id}-panel-{option.value}"
      tabindex={selected ? 0 : -1}
      class={[
        'h-8 shrink-0 cursor-default rounded-full px-4 text-[14px] whitespace-nowrap transition-[color,background-color,box-shadow] duration-200',
        selected ? 'bg-thumb text-ink shadow-thumb' : 'text-ink-2 hover:text-ink',
      ]}
      onclick={() => (value = option.value)}
      onkeydown={(event) => onkeydown(event, index)}
    >
      {option.label}
    </button>
  {/each}
</div>

{#each options as option (option.value)}
  <div
    role="tabpanel"
    id="{id}-panel-{option.value}"
    aria-labelledby="{id}-tab-{option.value}"
    hidden={option.value !== value}
  >
    {@render panel(option)}
  </div>
{/each}
