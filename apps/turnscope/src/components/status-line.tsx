export function StatusLine() {
  return (
    <div className="overflow-hidden rounded-xl bg-window px-5 py-4 font-mono text-[13px]/[1.65] tracking-normal shadow-window-edge">
      <div className="border-y border-ink-fainter py-1.5">
        <span className="text-ink-faint">&gt;</span>{' '}
        <span className="inline-block h-[1.1em] w-[0.6em] bg-ink-faint align-text-bottom motion-safe:animate-blink" />
      </div>
      <div className="mt-1.5 text-ink-secondary">
        Claude Max · 5h 28%, out in 1h · weekly 60% · Opus weekly used up, back Sat 09:00
      </div>
    </div>
  );
}
