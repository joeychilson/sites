import { Logo } from '@/components/logo';
import { Collapse } from '@/components/panel/collapse';
import { type Growth, LimitBar } from '@/components/panel/limit-bar';
import { ink } from '@/components/panel/standing';
import type { Account, Limit } from '@/lib/demo';

export function AccountRow({
  account,
  isOpen,
  onToggle,
}: {
  account: Account;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const detailsId = `${account.id}-details`;
  // Its limit lines say everything the status and figure do, so those give way to them.
  const showsLimits = isOpen && account.limits.length > 0;

  return (
    <span
      className={`relative block rounded-[10px] px-3 py-[7px] -outline-offset-2 transition-colors duration-120 ease-out hover:bg-row has-focus-visible:outline-2 has-focus-visible:outline-focus ${isOpen ? 'bg-row' : ''}`}
    >
      {/* Only the summary is the button, so a screen reader reads the details after it, line by
          line. Its ::after covers the row, so a click anywhere on it toggles it. */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={detailsId}
        onClick={onToggle}
        className="flex w-full items-center gap-2 text-start outline-none after:absolute after:inset-0 after:rounded-[10px]"
      >
        <Logo name={account.logo} width={18} height={18} className="shrink-0" />
        <span className="min-w-0 grow">
          <span className="block truncate text-[13px]/4">{account.name}</span>
          <Collapse isOpen={!showsLimits}>
            <span
              className={`block truncate pt-px text-[11px]/[14px] ${ink[account.standing] || 'text-label-secondary'}`}
            >
              {account.status}
            </span>
          </Collapse>
        </span>
        <span
          data-shown={!showsLimits || undefined}
          className="appears shrink-0 ps-2 text-[13px]/4 whitespace-nowrap tabular-nums"
        >
          <span className={`font-semibold ${ink[account.standing]}`}>{account.figure}</span>
          {account.of && <span className="text-label-secondary"> {account.of}</span>}
        </span>
      </button>
      <Collapse isOpen={isOpen}>
        <span id={detailsId} className="flex flex-col gap-2.5 pt-2.5 text-[11px]/[14px]">
          {account.limits.map((limit) => (
            <LimitLine key={limit.name} limit={limit} growth={isOpen ? 'now' : 'none'} />
          ))}
          {account.note && (
            <span className="text-[12px]/[15px] text-label-secondary">{account.note}</span>
          )}
          {account.usedMost && (
            <span className="flex flex-col gap-2">
              <span className="font-semibold text-label-secondary">
                Used most of {account.usedMost.limit}
              </span>
              {account.usedMost.sessions.map((session) => (
                <span key={session.title} className="flex flex-col gap-px">
                  <span className="flex items-center gap-[5px] text-[12px]/[15px]">
                    {session.title}
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-active" />
                    <span className="sr-only">Active now</span>
                  </span>
                  <span className="text-label-secondary tabular-nums">{session.used}</span>
                </span>
              ))}
            </span>
          )}
        </span>
      </Collapse>
    </span>
  );
}

// A limit's name, when it runs out and resets, and what's left, above its bar. Only the times take
// a standing's color, not the dots between them.
export function LimitLine({ limit, growth }: { limit: Limit; growth: Growth }) {
  return (
    <span className="flex flex-col gap-[5px]">
      <span className="flex items-baseline gap-2">
        <span className="min-w-0 grow truncate text-label-secondary">
          <span className="font-medium">{limit.name}</span>
          {limit.runsOut && (
            <>
              {' · '}
              <span className={ink[limit.standing]}>{limit.runsOut}</span>
            </>
          )}
          {limit.resets && (
            <>
              {' · '}
              <span className={limit.standing === 'usedUp' ? ink.usedUp : undefined}>
                {limit.resets}
              </span>
            </>
          )}
        </span>
        <span className="shrink-0 tabular-nums">
          <span className={`font-medium ${ink[limit.standing]}`}>{limit.left}</span>
          {limit.of && <span className="text-label-secondary"> {limit.of}</span>}
        </span>
      </span>
      <LimitBar percent={limit.percent} standing={limit.standing} growth={growth} />
    </span>
  );
}
