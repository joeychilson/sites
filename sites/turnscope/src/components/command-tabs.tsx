import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { type KeyboardEvent, useLayoutEffect, useRef, useState } from 'react';

import { media, motion, tokens } from '../styles/tokens.stylex';
import { useHeightTransition } from '../use-height-transition';
import Command from './command';

export type TabbedCommand = {
  label: string;
  code: string;
  /** The file the code goes in, when it isn't a command to run. */
  file?: string;
};

type CommandTabsProps = {
  /** Starts the ids of its tabs and panel, so it must be unique on the page. */
  id: string;
  label: string;
  commands: ReadonlyArray<TabbedCommand>;
};

/** Commands to pick between: a segmented control, or a pop-up menu on narrow screens. */
export default function CommandTabs({ id, label, commands }: CommandTabsProps) {
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const [selected, setSelected] = useState(0);
  // Where the selected tab is, once measured in the browser. Until then, or while the tabs are
  // hidden for the pop-up menu, the tab draws its own thumb.
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);
  const [box, measureBox] = useHeightTransition<HTMLDivElement>(selected);
  const command = commands[selected];

  useLayoutEffect(() => {
    const tab = tabs.current[selected];
    setThumb(tab?.offsetWidth ? { left: tab.offsetLeft, width: tab.offsetWidth } : null);
  }, [selected]);

  if (!command) return null;

  const select = (index: number) => {
    measureBox();
    setSelected(index);
  };

  const move = (event: KeyboardEvent, index: number) => {
    const count = commands.length;
    const moves: Partial<Record<string, number>> = {
      ArrowRight: (index + 1) % count,
      ArrowLeft: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <div {...stylex.props(styles.tabs)}>
      <span {...stylex.props(styles.popUp)}>
        <select
          aria-label={label}
          value={selected}
          onChange={(event) => select(Number(event.target.value))}
          {...stylex.props(styles.select)}
        >
          {commands.map((candidate, index) => (
            <option key={candidate.label} value={index}>
              {candidate.label}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 12 12" aria-hidden="true" {...stylex.props(styles.chevrons)}>
          <path d="m3.5 4.5 2.5-2.5 2.5 2.5M3.5 7.5 6 10l2.5-2.5" />
        </svg>
      </span>

      <div role="tablist" aria-label={label} {...stylex.props(styles.track)}>
        {thumb && (
          <span
            aria-hidden="true"
            {...stylex.props(styles.thumb, styles.thumbAt(`${thumb.left}px`, `${thumb.width}px`))}
          />
        )}
        {commands.map((candidate, index) => {
          const isSelected = index === selected;
          return (
            <button
              key={candidate.label}
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
              onKeyDown={(event) => move(event, index)}
              {...stylex.props(
                styles.tab,
                isSelected && styles.selected,
                isSelected && !thumb && styles.ownThumb,
              )}
            >
              {candidate.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${selected}`}
        {...stylex.props(styles.panel)}
      >
        {command.file && (
          <p {...stylex.props(styles.file)}>
            Add to <code {...stylex.props(styles.fileName)}>{command.file}</code>:
          </p>
        )}
        <div {...stylex.props(command.file ? styles.underFile : styles.underTabs)}>
          {/* Keyed, so a newly picked command doesn't show the last one's "Copied". */}
          <Command
            key={selected}
            ref={box}
            command={command.code}
            isPreformatted={command.file !== undefined}
          />
        </div>
      </div>
    </div>
  );
}

const styles = stylex.create({
  tabs: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  popUp: {
    position: 'relative',
    display: { default: 'none', [media.narrow]: 'inline-flex' },
  },
  select: {
    height: 36,
    paddingInlineStart: 16,
    paddingInlineEnd: 36,
    borderRadius: 999,
    backgroundColor: colorVars['--color-background-muted'],
    color: colorVars['--color-text-primary'],
    fontSize: 15,
    appearance: 'none',
    cursor: 'default',
  },
  chevrons: {
    position: 'absolute',
    top: '50%',
    right: 14,
    width: 12,
    height: 12,
    translate: '0 -50%',
    fill: 'none',
    stroke: colorVars['--color-text-secondary'],
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    pointerEvents: 'none',
  },
  track: {
    position: 'relative',
    display: { default: 'inline-flex', [media.narrow]: 'none' },
    gap: 2,
    maxWidth: '100%',
    padding: 3,
    overflowX: 'auto',
    borderRadius: 999,
    backgroundColor: colorVars['--color-background-muted'],
    scrollbarWidth: 'none',
  },
  // Slides to the picked tab on the app's spring.
  thumb: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    left: 0,
    borderRadius: 999,
    backgroundColor: tokens.thumb,
    boxShadow: tokens.shadowThumb,
    transitionProperty: 'translate, width',
    transitionDuration: { default: motion.spring, [media.reducedMotion]: '0s' },
    transitionTimingFunction: tokens.easeSpring,
  },
  thumbAt: (left: string, width: string) => ({
    translate: `${left} 0`,
    width,
  }),
  tab: {
    position: 'relative',
    flexShrink: 0,
    height: 32,
    paddingInline: 16,
    borderRadius: 999,
    color: {
      default: colorVars['--color-text-secondary'],
      ':hover': colorVars['--color-text-primary'],
    },
    fontSize: 14,
    whiteSpace: 'nowrap',
    cursor: 'default',
    transitionProperty: 'color',
    transitionDuration: '200ms',
  },
  selected: {
    color: colorVars['--color-text-primary'],
  },
  ownThumb: {
    backgroundColor: tokens.thumb,
    boxShadow: tokens.shadowThumb,
  },
  panel: {
    width: '100%',
  },
  file: {
    marginTop: 20,
    fontSize: 14,
    lineHeight: 1.5,
    color: colorVars['--color-text-disabled'],
  },
  fileName: {
    fontSize: 13,
    lineHeight: 'inherit',
    color: colorVars['--color-text-secondary'],
  },
  underFile: {
    marginTop: 12,
  },
  underTabs: {
    marginTop: 16,
  },
});
