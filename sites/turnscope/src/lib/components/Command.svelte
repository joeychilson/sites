<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  // A command with a Copy button. Long commands break after a slash; with
  // `pre`, such as for JSON, lines stay as written and scroll sideways.
  let {
    command,
    pre = false,
    class: className,
  }: { command: string; pre?: boolean; class?: ClassValue } = $props();

  const parts = $derived(pre ? [command] : command.split(/(?<=\/)/));

  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  // Clear the timer if the component is removed first.
  $effect(() => () => clearTimeout(timer));

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    copied = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied = false), 1800);
  }
</script>

<div class={['flex items-start gap-3 rounded-row bg-fill py-1.5 pr-1.5 pl-4', className]}>
  <code
    class={[
      'min-w-0 flex-1 py-[5px] font-mono text-[13px] leading-[22px] tracking-normal text-ink',
      pre ? 'overflow-x-auto whitespace-pre' : 'whitespace-pre-wrap [overflow-wrap:break-word]',
    ]}
    >{#each parts as part, index (index)}{#if index}<wbr />{/if}{part}{/each}</code
  >
  <button
    type="button"
    class="h-8 w-[74px] shrink-0 cursor-default rounded-full bg-thumb text-[13px] font-medium text-ink shadow-thumb transition-colors hover:bg-raised"
    onclick={copy}
  >
    {copied ? 'Copied' : 'Copy'}
  </button>
  <span class="sr-only" aria-live="polite">{copied ? 'Copied to the clipboard' : ''}</span>
</div>
