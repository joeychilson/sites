import type { ReactNode } from 'react';

export function Terminal({
  title,
  streams = false,
  children,
}: {
  title: string;
  streams?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-window text-start shadow-window">
      <div className="relative flex h-9 items-center px-3.5">
        <span aria-hidden="true" className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="absolute inset-x-0 text-center text-[13px] font-semibold text-ink-faint">
          {title}
        </span>
      </div>
      <div
        className={`px-5 pt-2 pb-6 font-mono text-[13px]/[1.65] tracking-normal ${streams ? 'motion-safe:streams' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}

// A turn in an agent's transcript: what was asked, what the agent did or said, or a tool's output
// under it.
export function Turn({
  mark,
  kind = 'said',
  children,
}: {
  mark: string;
  kind?: 'asked' | 'said' | 'output';
  children: ReactNode;
}) {
  if (kind === 'output') {
    return (
      <p className="grid grid-cols-[3ch_minmax(0,1fr)] ps-[2ch] text-ink-secondary">
        <span className="text-ink-faint">{mark}</span>
        <span>{children}</span>
      </p>
    );
  }
  return (
    <p
      className={`mt-4 grid grid-cols-[2ch_minmax(0,1fr)] first:mt-0 ${kind === 'asked' ? 'text-ink-secondary' : ''}`}
    >
      <span className={kind === 'asked' ? 'text-ink-faint' : undefined}>{mark}</span>
      <span>{children}</span>
    </p>
  );
}
