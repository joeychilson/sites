import type { ReactNode } from 'react';

const layouts = {
  stacked: 'flex flex-col gap-12',
  'text-left': 'grid items-start gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]',
  'text-right': 'grid items-start gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]',
};

export function Section({
  id,
  title,
  description,
  aside,
  layout,
  children,
}: {
  id: string;
  title: string;
  description: ReactNode;
  aside?: ReactNode;
  layout: keyof typeof layouts;
  children: ReactNode;
}) {
  const isSplit = layout !== 'stacked';
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="column">
      <div className={`mx-auto mt-28 max-w-270 rise-in-view sm:mt-40 ${layouts[layout]}`}>
        {/* Beside a tall example, the text stays in view while it scrolls past. */}
        <div className={`max-w-140 ${isSplit ? 'top-24 lg:sticky' : ''}`}>
          <h2
            id={`${id}-title`}
            className="text-[30px]/[1.1] font-semibold tracking-[-0.035em] text-balance sm:text-[40px]"
          >
            {title}
          </h2>
          <p className="mt-4 text-[17px]/[1.6] text-pretty text-ink-secondary">{description}</p>
          {aside}
        </div>
        <div className={`min-w-0 ${layout === 'text-right' ? 'lg:-order-1' : ''}`}>{children}</div>
      </div>
    </section>
  );
}
