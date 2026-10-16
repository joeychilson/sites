import type { CSSProperties, ReactNode } from 'react';

export function PageHeader({
  title,
  children,
  style,
}: {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <header className="mt-16 motion-safe:rise-0">
      <h1 className="w-fit text-[22px]/[30px] font-[560] tracking-[-0.014em]" style={style}>
        {title}
      </h1>
      <p className="mt-1 text-ink-faint">{children}</p>
    </header>
  );
}
