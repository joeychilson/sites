<script lang="ts">
  import Glyph from '#lib/components/Glyph.svelte';
  import Logo, { type LogoName } from '#lib/components/Logo.svelte';

  // Settings' Agents tab, a page of the panel (SettingsPage.swift in the
  // Turnscope repo), for the agents in the feed the README's screenshots are
  // drawn from: one connected, one to connect, one running an older copy of
  // Turnscope, and one that doesn't use MCP. Connect and Update work as the
  // app's do: a moment's spinner while the agent's own command runs, then
  // connected.
  type Status = 'connected' | 'available' | 'outdated' | 'unsupported';

  const agents: { id: string; name: string; logo: LogoName; status: Status }[] = [
    { id: 'claude', name: 'Claude Code', logo: 'anthropic', status: 'connected' },
    { id: 'codex', name: 'Codex', logo: 'openai', status: 'available' },
    { id: 'opencode', name: 'OpenCode', logo: 'opencode', status: 'outdated' },
    { id: 'pi', name: 'Pi', logo: 'pi', status: 'unsupported' },
  ];

  let statuses = $state<Record<string, Status>>(
    Object.fromEntries(agents.map((agent) => [agent.id, agent.status])),
  );
  let connecting = $state<string[]>([]);

  function connect(id: string) {
    connecting = [...connecting, id];
    setTimeout(() => {
      connecting = connecting.filter((other) => other !== id);
      statuses[id] = 'connected';
    }, 900);
  }
</script>

<div class="mac glass w-[340px] max-w-full rounded-[14px] pb-3.5 shadow-glass select-none">
  <div class="flex items-center gap-1 pt-2.5 pr-3 pb-3 pl-2.5" aria-hidden="true">
    <span class="grid size-7 place-items-center text-label-2"><Glyph name="back" /></span>
    <span class="flex-1 text-[15px] font-semibold">Settings</span>
    <!-- A small segmented control, on its own tab. -->
    <span class="flex rounded-[7px] bg-label-4 p-px text-[11px] leading-[18px]">
      <span class="px-2.5 text-label-2">General</span>
      <span class="rounded-[6px] bg-thumb px-2.5 shadow-thumb">Agents</span>
      <span class="px-2.5 text-label-2">Accounts</span>
    </span>
  </div>
  <div class="px-2">
    <p class="px-3 pb-2 text-[11px] leading-[14px] text-label-2">
      Connected agents can ask Turnscope how their limits stand, what used them and why, and pick
      up each other’s work. Connecting runs the agent’s own command for adding an MCP server.
    </p>
    <ul>
      {#each agents as agent (agent.id)}
        {@const status = statuses[agent.id]}
        <li class="flex h-[30px] items-center gap-2.5 px-3">
          <Logo name={agent.logo} class="size-3.5 text-label-2" />
          <span class="flex-1 text-[13px]">{agent.name}</span>
          {#if connecting.includes(agent.id)}
            <span class="spinner" role="status" aria-label="Connecting {agent.name}"></span>
          {:else if status === 'connected'}
            <span class="flex items-center gap-1 text-[12px] text-label-2">
              <Glyph name="checkmark" class="size-3" />
              Connected
            </span>
          {:else if status === 'unsupported'}
            <span class="text-[12px] text-label-3">{agent.name} doesn’t use MCP</span>
          {:else}
            <button
              type="button"
              class="pill"
              aria-label="{status === 'outdated' ? 'Update' : 'Connect'} {agent.name}"
              onclick={() => connect(agent.id)}
            >
              {status === 'outdated' ? 'Update' : 'Connect'}
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  /* A row's one action, as the app's PillButton: quiet, filling on hover. */
  .pill {
    display: inline-flex;
    height: 22px;
    align-items: center;
    padding-inline: 10px;
    border-radius: 9999px;
    background: var(--color-label-4);
    font-size: 12px;
    font-weight: 500;
    cursor: default;
    transition: background-color 100ms;
  }

  .pill:hover {
    background: light-dark(rgb(0 0 0 / 0.14), rgb(255 255 255 / 0.16));
  }

  .pill:active {
    background: light-dark(rgb(0 0 0 / 0.2), rgb(255 255 255 / 0.22));
  }

  /* The system's mini progress indicator, as near as a ring comes. */
  .spinner {
    width: 12px;
    height: 12px;
    margin-right: 4px;
    border-radius: 9999px;
    border: 1.5px solid var(--color-label-4);
    border-top-color: var(--color-label-2);
    animation: turn 800ms linear infinite;
  }

  @keyframes turn {
    to {
      transform: rotate(360deg);
    }
  }
</style>
