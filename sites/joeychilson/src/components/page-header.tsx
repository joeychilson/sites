import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: ReactNode;
  /** A quiet line under the title. */
  children: ReactNode;
};

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header {...stylex.props(styles.header)}>
      <h1 {...stylex.props(styles.title)}>{title}</h1>
      <p {...stylex.props(styles.subtitle)}>{children}</p>
    </header>
  );
}

const styles = stylex.create({
  header: {
    marginTop: 64,
  },
  title: {
    fontSize: 22,
    lineHeight: '30px',
    fontWeight: 560,
    letterSpacing: '-0.014em',
    textWrap: 'balance',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: colorVars['--color-text-disabled'],
  },
});
