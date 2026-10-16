import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { site } from '../site';
import { layout } from '../styles/layout';
import { media } from '../styles/tokens.stylex';
import Mark from './mark';
import PillLink from './pill-link';

const links = [
  { label: 'For agents', href: '/#agents' },
  { label: 'Privacy', href: '/#privacy' },
  { label: 'Install', href: '/#install' },
  { label: 'GitHub', href: site.repo },
];

export default function Header() {
  return (
    <>
      <a href="#main" {...stylex.props(styles.skip)}>
        Skip to content
      </a>
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(layout.column, styles.bar)}>
          <a href="/" {...stylex.props(styles.home)}>
            <Mark width={16} height={16} />
            {site.name}
          </a>
          <nav aria-label="Site" {...stylex.props(styles.nav)}>
            {links.map((link) => (
              <a key={link.href} href={link.href} {...stylex.props(styles.link)}>
                {link.label}
              </a>
            ))}
            <PillLink href="/download" size="small">
              Download
            </PillLink>
          </nav>
        </div>
      </header>
    </>
  );
}

const styles = stylex.create({
  skip: {
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: 50,
    paddingInline: 16,
    paddingBlock: 8,
    borderRadius: 999,
    backgroundColor: colorVars['--color-background-popover'],
    fontSize: 15,
    translate: { default: '0 -200%', ':focus-visible': 'none' },
  },
  // Sticky and frosted, so the page shows dimly through it as it scrolls by.
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 30,
    backgroundColor: `color-mix(in srgb, ${colorVars['--color-background-body']} 72%, transparent)`,
    backdropFilter: 'saturate(1.8) blur(20px)',
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    height: 64,
  },
  home: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
    fontWeight: 600,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 28,
    marginInlineStart: 'auto',
    fontSize: 14,
    color: colorVars['--color-text-secondary'],
  },
  link: {
    display: { default: null, [media.narrow]: 'none' },
    color: { default: 'inherit', ':hover': colorVars['--color-text-primary'] },
    transitionProperty: 'color',
    transitionDuration: '150ms',
  },
});
