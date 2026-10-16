import { Link } from '@tanstack/react-router';
import { useState } from 'react';

type Item = { title: string; note: string } & ({ href: string } | { slug: string });

interface Spot {
  top: number;
  height: number;
  isShown: boolean;
  isGliding: boolean;
}

const row = 'group relative flex justify-between gap-6 rounded-lg px-3 py-2 outline-offset-0';

export function LinkList({ items, stacksNote = false }: { items: Item[]; stacksNote?: boolean }) {
  const rowClass = stacksNote ? `${row} max-sm:flex-col max-sm:gap-0` : row;
  const [spot, setSpot] = useState<Spot>({ top: 0, height: 0, isShown: false, isGliding: false });

  const show = ({ currentTarget }: { currentTarget: HTMLElement }) =>
    setSpot((current) => ({
      top: currentTarget.offsetTop,
      height: currentTarget.offsetHeight,
      isShown: true,
      isGliding: current.isShown,
    }));

  const hide = () => setSpot((current) => ({ ...current, isShown: false }));

  const spotlit = { onPointerEnter: show, onFocus: show, onBlur: hide };

  return (
    <div className="relative -mx-3 mt-2" onPointerLeave={hide}>
      <span
        aria-hidden="true"
        style={{ translate: `0 ${spot.top}px`, height: spot.height }}
        className={`pointer-events-none absolute inset-x-0 top-0 rounded-lg bg-muted duration-250 ease-out motion-reduce:transition-none ${spot.isShown ? 'opacity-100' : 'opacity-0'} ${spot.isGliding ? 'transition-[translate,height,opacity]' : 'transition-opacity'}`}
      />
      <ul>
        {items.map((item) => {
          const content = (
            <>
              <span
                style={'slug' in item ? { viewTransitionName: `post-${item.slug}` } : undefined}
              >
                {item.title}
              </span>
              <span className="shrink-0 text-ink-faint tabular-nums transition-colors group-hover:text-ink-secondary">
                {item.note}
              </span>
            </>
          );
          return (
            <li key={item.title}>
              {'slug' in item ? (
                <Link
                  to="/writing/$slug"
                  params={{ slug: item.slug }}
                  className={rowClass}
                  {...spotlit}
                >
                  {content}
                </Link>
              ) : (
                <a href={item.href} className={rowClass} {...spotlit}>
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
