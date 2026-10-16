import { Logo, type LogoName } from '@/components/logo';

export function LogoRow({
  title,
  names,
}: {
  title: string;
  names: { name: string; plan?: string; logo: LogoName }[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
      <h2 className="text-[14px] tracking-normal text-ink-faint">{title}</h2>
      <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3">
        {names.map((named) => (
          <li
            key={named.name}
            className="inline-flex items-center gap-2 text-[15px] whitespace-nowrap text-ink-secondary"
          >
            <Logo name={named.logo} width={18} height={18} className="shrink-0 text-ink" />
            {named.name}
            {named.plan && <span className="text-ink-faint">{named.plan}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
