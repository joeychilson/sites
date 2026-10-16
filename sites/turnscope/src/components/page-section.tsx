import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import { reveal } from '../styles/reveal';
import { media } from '../styles/tokens.stylex';
import Column from './column';

type PageSectionProps = {
  /** Names the heading, and the section when it's a link target. */
  id: string;
  title: string;
  description: ReactNode;
  /** More text under the description: a note, a link. */
  aside?: ReactNode;
  /** Split puts the text beside the content on wide screens; stacked puts it above. */
  layout: 'split' | 'stacked';
  /** In a split, the content comes first. */
  isFlipped?: boolean;
  children: ReactNode;
};

/** One of the page's sections: its title and description, and what it shows. */
export default function PageSection({
  id,
  title,
  description,
  aside,
  layout,
  isFlipped = false,
  children,
}: PageSectionProps) {
  return (
    <Column as="section" id={id} aria-labelledby={`${id}-title`}>
      <div
        {...stylex.props(
          styles.section,
          layouts[layout],
          isFlipped && layouts.flipped,
          reveal.rise,
        )}
      >
        <div {...stylex.props(styles.text, layout === 'split' && styles.splitText)}>
          <h2 id={`${id}-title`} {...stylex.props(styles.title)}>
            {title}
          </h2>
          <p {...stylex.props(styles.description)}>{description}</p>
          {aside}
        </div>
        <div {...stylex.props(styles.content, isFlipped && styles.flipped)}>{children}</div>
      </div>
    </Column>
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
  splitText: {
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
  flipped: {
    order: { default: null, [media.large]: -1 },
  },
});

const layouts = stylex.create({
  split: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr', [media.large]: 'minmax(0, 5fr) minmax(0, 7fr)' },
    alignItems: 'start',
    columnGap: 64,
    rowGap: 40,
  },
  // The content takes the wider column, on whichever side it's on.
  flipped: {
    gridTemplateColumns: { default: '1fr', [media.large]: 'minmax(0, 7fr) minmax(0, 5fr)' },
  },
  stacked: {
    display: 'flex',
    flexDirection: 'column',
    gap: 48,
  },
});
