import { colorVars, typographyVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { text } from '../styles/text';
import { media } from '../styles/tokens.stylex';

export type Feature = {
  title: string;
  /** Beside the title in quiet type, saying what kind of thing it is. */
  tag?: string;
  text: string;
};

type FeatureListProps = {
  features: Array<Feature>;
  columns: keyof typeof grids;
  /** Sets the titles as code, for names like an MCP tool's. */
  hasCodeTitles?: boolean;
};

export default function FeatureList({
  features,
  columns,
  hasCodeTitles = false,
}: FeatureListProps) {
  return (
    <ul {...stylex.props(styles.grid, grids[columns])}>
      {features.map((feature) => (
        <li key={feature.title}>
          <h3 {...stylex.props(hasCodeTitles ? styles.codeTitle : styles.title)}>
            {feature.title}
            {feature.tag && <span {...stylex.props(styles.tag)}>{feature.tag}</span>}
          </h3>
          <p {...stylex.props(text.body, styles.text)}>{feature.text}</p>
        </li>
      ))}
    </ul>
  );
}

const grids = stylex.create({
  two: {
    gridTemplateColumns: { default: '1fr', [media.wide]: 'repeat(2, 1fr)' },
  },
  three: {
    gridTemplateColumns: {
      default: '1fr',
      [media.wide]: 'repeat(2, 1fr)',
      [media.large]: 'repeat(3, 1fr)',
    },
  },
});

const styles = stylex.create({
  grid: {
    display: 'grid',
    columnGap: 40,
    rowGap: 36,
  },
  title: {
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  codeTitle: {
    fontFamily: typographyVars['--font-family-code'],
    fontSize: 14,
    lineHeight: '24px',
    fontWeight: 500,
    letterSpacing: 'normal',
  },
  tag: {
    marginInlineStart: 8,
    fontFamily: typographyVars['--font-family-body'],
    fontSize: 13,
    fontWeight: 400,
    color: colorVars['--color-text-disabled'],
  },
  text: {
    marginTop: 6,
  },
});
