import { Logo, type LogoName } from '@/components/logo';
import { ink } from '@/components/panel/standing';
import type { Standing } from '@/lib/demo';

export function MenuBarItem({
  logo,
  figure,
  standing,
}: {
  logo: LogoName;
  figure: string;
  standing: Standing;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-px whitespace-nowrap">
      <Logo name={logo} width={21} height={21} />
      <span className={`text-[13px] font-semibold tabular-nums ${ink[standing]}`}>{figure}</span>
    </span>
  );
}
