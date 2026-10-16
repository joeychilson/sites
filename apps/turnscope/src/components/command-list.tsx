export function CommandList({ commands }: { commands: { command: string; does: string }[] }) {
  return (
    <ul className="rounded-xl bg-muted px-5 py-4 font-mono text-[13px]/[22px] tracking-normal">
      {commands.map(({ command, does }) => (
        <li key={command} className="flex flex-col py-[5px] sm:py-[3px]">
          <span>{command}</span>
          <span className="text-ink-faint"># {does}</span>
        </li>
      ))}
    </ul>
  );
}
