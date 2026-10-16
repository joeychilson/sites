import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { type FocusEvent, type PointerEvent, useState } from 'react';

import { media, tokens } from '../styles/tokens.stylex';

type Row = {
  href: string;
  title: string;
  meta: string;
  /** Names the title so it glides into the page it opens. */
  transitionName?: string;
};

type RowsProps = {
  rows: Array<Row>;
  /** Puts a long meta under its title on a phone, rather than beside it. */
  isStacked?: boolean;
};

/**
 * Links in rows under one highlight. It fades in on the row the pointer enters, glides from row to
 * row, and fades out where it is when the pointer leaves, so coming from another list it never
 * slides in.
 */
export default function Rows({ rows, isStacked = false }: RowsProps) {
  const [spot, setSpot] = useState({ top: 0, height: 0 });
  const [isShown, setIsShown] = useState(false);
  const [isGliding, setIsGliding] = useState(false);

  const point = (row: HTMLElement) => {
    setIsGliding(isShown);
    setSpot({ top: row.offsetTop, height: row.offsetHeight });
    setIsShown(true);
  };

  // Moving to another row keeps the highlight; leaving the list fades it out where it is.
  const leave = (event: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node && event.currentTarget.closest('ul')?.contains(next))) {
      setIsShown(false);
    }
  };

  return (
    <div {...stylex.props(styles.list)}>
      <span
        aria-hidden="true"
        {...stylex.props(
          styles.highlight,
          isGliding && styles.glides,
          isShown && styles.shown,
          styles.spot(`${spot.top}px`, `${spot.height}px`),
        )}
      />
      <ul>
        {rows.map((row) => (
          <li key={row.href}>
            <a
              href={row.href}
              onPointerEnter={(event) => point(event.currentTarget)}
              onPointerLeave={leave}
              onFocus={(event) => point(event.currentTarget)}
              onBlur={leave}
              {...stylex.props(styles.row, isStacked ? styles.stacked : styles.inline)}
            >
              <span {...stylex.props(styles.title)}>
                <span
                  {...stylex.props(row.transitionName ? styles.named(row.transitionName) : null)}
                >
                  {row.title}
                </span>
              </span>
              <span {...stylex.props(styles.meta, !isStacked && styles.fixed)}>{row.meta}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = stylex.create({
  list: {
    position: 'relative',
    marginInline: -12,
  },
  highlight: {
    position: 'absolute',
    insetInline: 0,
    top: 0,
    borderRadius: 8,
    backgroundColor: colorVars['--color-background-muted'],
    opacity: 0,
    pointerEvents: 'none',
    transitionProperty: 'opacity',
    transitionDuration: '250ms',
    transitionTimingFunction: tokens.easeOut,
  },
  glides: {
    transitionProperty: { default: 'translate, height, opacity', [media.reducedMotion]: 'opacity' },
  },
  shown: {
    opacity: 1,
  },
  spot: (top: string, height: string) => ({
    translate: `0 ${top}`,
    height,
  }),
  row: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    paddingInline: 12,
    paddingBlock: 8,
    borderRadius: 8,
  },
  inline: {
    alignItems: 'baseline',
    gap: 24,
  },
  stacked: {
    flexDirection: { default: 'column', [media.wide]: 'row' },
    alignItems: { default: null, [media.wide]: 'baseline' },
    gap: { default: 0, [media.wide]: 24 },
  },
  title: {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  named: (name: string) => ({
    viewTransitionName: name,
  }),
  meta: {
    color: colorVars['--color-text-disabled'],
    fontVariantNumeric: 'tabular-nums',
  },
  fixed: {
    flexShrink: 0,
  },
});
