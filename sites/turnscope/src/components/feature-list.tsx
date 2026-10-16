import { colorVars, typographyVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { media } from '../styles/tokens.stylex';

export type Feature = {
  title: string;
  /** A quieter word after the title. */
  tag?: string;
  text: string;
};

type FeatureListProps = {
  features: Array<Feature>;
  /** Columns on wide screens; phones show one, tablets two. */
  columns: keyof typeof grids;
  /** Titles are names in code, such as MCP tools. */
  hasCodeTitles?: boolean;
};

/** Short features, each a title and a sentence, in a grid. */
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
          <p {...stylex.props(styles.text)}>{feature.text}</p>
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
    fontSize: 15,
    lineHeight: 1.6,
    color: colorVars['--color-text-secondary'],
    textWrap: 'pretty',
  },
});
