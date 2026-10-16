import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { type KeyboardEvent, useLayoutEffect, useRef, useState } from 'react';

import { media, tokens } from '../styles/tokens.stylex';
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
  /** Names the tabs for screen readers. */
  label: string;
  commands: Array<TabbedCommand>;
};

/** One command or snippet per tab, ready to copy: a segmented control, or a pop-up button on a phone. */
export default function CommandTabs({ id, label, commands }: CommandTabsProps) {
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const thumb = useRef<HTMLSpanElement>(null);
  const thumbFrom = useRef<{ left: number; width: number } | null>(null);
  const [selected, setSelected] = useState(0);
  // The box stays, its command changes in place, and its height eases when the new one is longer
  // or shorter.
  const [box, measureBox] = useHeightTransition<HTMLDivElement>(selected);
  const command = commands[selected];

  const select = (index: number) => {
    if (index === selected) return;
    const tab = tabs.current[selected];
    thumbFrom.current = tab ? { left: tab.offsetLeft, width: tab.offsetWidth } : null;
    measureBox();
    setSelected(index);
  };

  // The thumb is drawn in the chosen tab, and glides there from the last one on the spring.
  useLayoutEffect(() => {
    const from = thumbFrom.current;
    thumbFrom.current = null;
    const tab = tabs.current[selected];
    if (!from || !tab || !thumb.current) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    thumb.current.animate(
      [
        { translate: `${from.left - tab.offsetLeft}px 0`, width: `${from.width}px` },
        { translate: '0 0', width: `${tab.offsetWidth}px` },
      ],
      { duration: 400, easing: getComputedStyle(tab).getPropertyValue('--ease-spring') },
    );
  }, [selected]);

  // Arrow keys move between tabs, wrapping around; Home and End go to the ends.
  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: commands.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + commands.length) % commands.length;
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
              onKeyDown={(event) => onKeyDown(event, index)}
              {...stylex.props(styles.tab, isSelected && styles.selectedTab)}
            >
              {isSelected && <span ref={thumb} {...stylex.props(styles.thumb)} />}
              <span {...stylex.props(styles.tabLabel)}>{candidate.label}</span>
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
        <div {...stylex.props(command.file ? styles.afterFile : styles.afterTabs)}>
          <Command ref={box} command={command.code} isPre={Boolean(command.file)} />
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
    display: { default: 'inline-flex', [media.narrow]: 'none' },
    gap: 2,
    maxWidth: '100%',
    padding: 3,
    overflowX: 'auto',
    borderRadius: 999,
    backgroundColor: colorVars['--color-background-muted'],
    scrollbarWidth: 'none',
  },
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
  selectedTab: {
    color: colorVars['--color-text-primary'],
  },
  // Under every label, even the tabs it glides across on its way.
  thumb: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 0,
    borderRadius: 999,
    backgroundColor: tokens.thumb,
    boxShadow: tokens.shadowThumb,
  },
  tabLabel: {
    position: 'relative',
    zIndex: 1,
    display: 'inline-block',
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
  afterFile: {
    marginTop: 12,
  },
  afterTabs: {
    marginTop: 16,
  },
});
