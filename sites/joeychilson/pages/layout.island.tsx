import '../src/styles/global.css';
import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { useShared } from '@void/react';
import type { ReactNode } from 'react';

import Skyline from '../src/islands/skyline' with { island: 'load' };
import { site } from '../src/site';
import { media, tokens } from '../src/styles/tokens.stylex';

export default function Layout({ children }: { children: ReactNode }) {
  const { path } = useShared();

  return (
    <div {...stylex.props(styles.column)}>
      {/* The same on every page, so it holds still as pages crossfade beneath it. */}
      <header>
        <Skyline />
        {/* On the home page the name is its heading; elsewhere it leads home. */}
        {path === '/' ? (
          <h1 {...stylex.props(styles.name)}>{site.name}</h1>
        ) : (
          <a href="/" {...stylex.props(styles.name, styles.home)}>
            {site.name}
          </a>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}

const styles = stylex.create({
  column: {
    maxWidth: 540 + 48,
    marginInline: 'auto',
    paddingInline: 24,
    paddingTop: { default: 40, [media.wide]: 80 },
    paddingBottom: 96,
  },
  name: {
    display: 'block',
    width: 'fit-content',
    marginTop: 32,
    fontFamily: tokens.pixelFont,
    fontSize: 33,
    fontWeight: 400,
    lineHeight: '33px',
    letterSpacing: 0,
  },
  home: {
    color: {
      default: colorVars['--color-text-primary'],
      ':hover': colorVars['--color-text-secondary'],
    },
    transitionProperty: 'color',
    transitionDuration: '150ms',
  },
});
