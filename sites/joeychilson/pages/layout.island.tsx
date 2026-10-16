import '../src/styles/global.css';
import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { useShared } from '@void/react';
import type { ReactNode } from 'react';

import Skyline from '../src/components/skyline' with { island: 'load' };
import { site } from '../src/site';
import { city, media } from '../src/styles/tokens.stylex';

export default function Layout({ children }: { children: ReactNode }) {
  const { path } = useShared();

  return (
    <div {...stylex.props(styles.column)}>
      {/* The same on every page, so it holds still while pages fade beneath it. */}
      <header>
        <Skyline />
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
    maxWidth: 540 + 2 * 24,
    marginInline: 'auto',
    paddingInline: 24,
    paddingTop: { default: 40, [media.wide]: 80 },
    paddingBottom: 96,
  },
  // The pixel face on its grid: 33px is three of its pixels to each of the font's 11.
  name: {
    display: 'block',
    width: 'fit-content',
    marginTop: 32,
    fontFamily: city.pixelFont,
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
