import { type KeyboardEvent, useLayoutEffect, useRef, useState } from 'react';

import { Command } from '@/components/command';
import { useHeightTransition } from '@/hooks/use-height-transition';
import type { Setup } from '@/lib/content';

// Pills in a row with the chosen one filled, as the app's Choice draws them, or a menu on a phone.
export function CommandTabs({ id, label, setups }: { id: string; label: string; setups: Setup[] }) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState(0);
  // Until it's measured, or while the tabs are hidden for the menu, the chosen tab fills itself.
  const [thumb, setThumb] = useState<{ left: number; width: number }>();
  const [box, animateHeight] = useHeightTransition<HTMLDivElement>();
  const setup = setups[selected];

  useLayoutEffect(() => {
    const tab = tabs.current[selected];
    setThumb(tab?.offsetWidth ? { left: tab.offsetLeft, width: tab.offsetWidth } : undefined);
  }, [selected]);

  const select = (index: number) => animateHeight(() => setSelected(index));

  const keys = (event: KeyboardEvent, index: number) => {
    const moves: Partial<Record<string, number>> = {
      ArrowRight: (index + 1) % setups.length,
      ArrowLeft: (index - 1 + setups.length) % setups.length,
      Home: 0,
      End: setups.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) {
      return;
    }
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="flex w-full flex-col items-start">
      <span className="relative hidden max-sm:inline-flex">
        <select
          aria-label={label}
          value={selected}
          onChange={(event) => select(Number(event.target.value))}
          className="h-9 appearance-none rounded-full bg-muted ps-4 pe-9 text-[16px] tracking-normal"
        >
          {setups.map((each, index) => (
            <option key={each.label} value={index}>
              {each.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 size-3 -translate-y-1/2 fill-none stroke-ink-secondary stroke-[1.5]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3.5 4.5 2.5-2.5 2.5 2.5M3.5 7.5 6 10l2.5-2.5" />
        </svg>
      </span>

      <div
        role="tablist"
        aria-label={label}
        className="relative inline-flex max-w-full [scrollbar-width:none] gap-0.5 overflow-x-auto rounded-full bg-muted p-[3px] max-sm:hidden"
      >
        {thumb && (
          <span
            aria-hidden="true"
            style={{ translate: `${thumb.left}px 0`, width: thumb.width }}
            className="absolute inset-y-[3px] left-0 rounded-full bg-thumb shadow-thumb transition-[translate,width] duration-(--spring) ease-spring motion-reduce:transition-none"
          />
        )}
        {setups.map((each, index) => {
          const isSelected = index === selected;
          return (
            <button
              key={each.label}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={isSelected}
              aria-controls={`${id}-panel`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => keys(event, index)}
              className={`relative h-8 shrink-0 rounded-full px-4 text-[14px] tracking-normal whitespace-nowrap text-ink-secondary transition-colors duration-200 hover:text-ink aria-selected:text-ink ${isSelected && !thumb ? 'bg-thumb shadow-thumb' : ''}`}
            >
              {each.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${selected}`}
        className="w-full"
      >
        {setup.file && (
          <p className="mt-5 text-[14px] text-ink-faint">
            Add to <code className="text-[13px] text-ink-secondary">{setup.file}</code>:
          </p>
        )}
        <div className={setup.file ? 'mt-3' : 'mt-4'}>
          {/* Keyed, so the next command doesn't show the last one's "Copied". */}
          <Command
            key={selected}
            ref={box}
            code={setup.code}
            keepsLines={setup.file !== undefined}
          />
        </div>
      </div>
    </div>
  );
}
