import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import { layout } from '../styles/layout';
import { media } from '../styles/tokens.stylex';

type PageSectionProps = {
  id: string;
  title: string;
  description: ReactNode;
  /** Under the description, such as a link to the docs. */
  aside?: ReactNode;
  /** Text above the content, or beside it on large screens with the text held in view. */
  arrangement: 'stacked' | 'split';
  /** Puts a split section's content on the left. */
  isFlipped?: boolean;
  children: ReactNode;
};

export default function PageSection({
  id,
  title,
  description,
  aside,
  arrangement,
  isFlipped = false,
  children,
}: PageSectionProps) {
  const isSplit = arrangement === 'split';
  return (
    <section id={id} aria-labelledby={`${id}-title`} {...stylex.props(layout.column)}>
      <div
        {...stylex.props(
          styles.section,
          isSplit ? arrangements.split : arrangements.stacked,
          isFlipped && arrangements.flipped,
          layout.rise,
        )}
      >
        <div {...stylex.props(styles.text, isSplit && styles.heldText)}>
          <h2 id={`${id}-title`} {...stylex.props(styles.title)}>
            {title}
          </h2>
          <p {...stylex.props(styles.description)}>{description}</p>
          {aside}
        </div>
        <div {...stylex.props(styles.content, isFlipped && styles.first)}>{children}</div>
      </div>
    </section>
  );
}

const styles = stylex.create({
  section: {
    maxWidth: 1080,
    marginInline: 'auto',
    marginTop: { default: 112, [media.wide]: 160 },
  },
  text: {
    maxWidth: 560,
  },
  heldText: {
    position: { default: null, [media.large]: 'sticky' },
    top: 96,
  },
  title: {
    fontSize: { default: 30, [media.wide]: 40 },
    lineHeight: 1.1,
    fontWeight: 600,
    letterSpacing: '-0.035em',
    textWrap: 'balance',
  },
  description: {
    marginTop: 16,
    fontSize: 17,
    lineHeight: 1.6,
    color: colorVars['--color-text-secondary'],
    textWrap: 'pretty',
  },
  content: {
    minWidth: 0,
  },
  first: {
    order: { default: null, [media.large]: -1 },
  },
});

// The content takes the wider column, on whichever side it's on.
const arrangements = stylex.create({
  stacked: {
    display: 'flex',
    flexDirection: 'column',
    gap: 48,
  },
  split: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr', [media.large]: 'minmax(0, 5fr) minmax(0, 7fr)' },
    alignItems: 'start',
    columnGap: 64,
    rowGap: 40,
  },
  flipped: {
    gridTemplateColumns: { default: '1fr', [media.large]: 'minmax(0, 7fr) minmax(0, 5fr)' },
  },
});
