import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { type FocusEvent, type PointerEvent, useState } from 'react';

import { city, media } from '../styles/tokens.stylex';

type Link = {
  href: string;
  title: string;
  /** On the right: what it is, or when. */
  meta: string;
  /** Names the title so it glides into the page it opens. */
  transitionName?: string;
};

type LinkListProps = {
  links: ReadonlyArray<Link>;
  /** Puts the meta under the title on narrow screens, for links whose meta is long. */
  stacksMeta?: boolean;
};

export default function LinkList({ links, stacksMeta = false }: LinkListProps) {
  const [spot, setSpot] = useState({ top: 0, height: 0 });
  const [isShown, setIsShown] = useState(false);
  const [glides, setGlides] = useState(false);

  // The highlight glides from row to row, but fades in where the pointer enters the list instead of
  // sliding over from the row it last faded out on.
  const point = (row: HTMLElement) => {
    setGlides(isShown);
    setSpot({ top: row.offsetTop, height: row.offsetHeight });
    setIsShown(true);
  };

  const leave = (event: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node && event.currentTarget.contains(next))) setIsShown(false);
  };

  return (
    <div onPointerLeave={leave} onBlur={leave} {...stylex.props(styles.list)}>
      <span
        aria-hidden="true"
        {...stylex.props(
          styles.highlight,
          glides && styles.glides,
          isShown && styles.shown,
          styles.spot(`${spot.top}px`, `${spot.height}px`),
        )}
      />
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onPointerEnter={(event) => point(event.currentTarget)}
              onFocus={(event) => point(event.currentTarget)}
              {...stylex.props(styles.row, stacksMeta ? styles.stacked : styles.inline)}
            >
              <span {...stylex.props(styles.title)}>
                <span
                  {...stylex.props(link.transitionName ? styles.named(link.transitionName) : null)}
                >
                  {link.title}
                </span>
              </span>
              <span {...stylex.props(styles.meta, !stacksMeta && styles.keepsWidth)}>
                {link.meta}
              </span>
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
    marginTop: 8,
    marginInline: -12,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    insetInline: 0,
    borderRadius: 8,
    backgroundColor: colorVars['--color-background-muted'],
    opacity: 0,
    pointerEvents: 'none',
    transitionProperty: 'opacity',
    transitionDuration: '250ms',
    transitionTimingFunction: city.easeOut,
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
  keepsWidth: {
    flexShrink: 0,
  },
});
