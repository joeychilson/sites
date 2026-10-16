import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { site } from '../site';
import { media, tokens } from '../styles/tokens.stylex';
import Column from './column';
import Mark from './mark';

const links = [
  { label: 'Source', href: site.repo },
  { label: 'Releases', href: `${site.repo}/releases` },
  { label: 'Issues', href: `${site.repo}/issues` },
  { label: 'License', href: `${site.repo}/blob/main/LICENSE` },
];

/** The site footer: who made it, the project's links, and the note on agent names and logos. */
export default function Footer() {
  return (
    <Column as="footer">
      <div {...stylex.props(styles.footer)}>
        <div {...stylex.props(styles.row)}>
          <p {...stylex.props(styles.credit)}>
            <Mark width={12} height={12} {...stylex.props(styles.mark)} />
            <span>
              Made by{' '}
              <a href={site.author.url} {...stylex.props(styles.link, styles.author)}>
                {site.author.name}
              </a>
            </span>
          </p>
          <nav aria-label="Project" {...stylex.props(styles.nav)}>
            {links.map((link) => (
              <a key={link.href} href={link.href} {...stylex.props(styles.link)}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p {...stylex.props(styles.note)}>Agent names and logos belong to their owners.</p>
      </div>
    </Column>
  );
}

const styles = stylex.create({
  footer: {
    paddingTop: { default: 96, [media.wide]: 128 },
    paddingBottom: 56,
    fontSize: 13,
    lineHeight: 1.5,
    color: colorVars['--color-text-disabled'],
  },
  row: {
    display: 'flex',
    flexDirection: { default: 'column', [media.wide]: 'row' },
    alignItems: { default: null, [media.wide]: 'center' },
    justifyContent: { default: null, [media.wide]: 'space-between' },
    gap: 24,
  },
  credit: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 'inherit',
    color: 'inherit',
  },
  mark: {
    color: tokens.textFaint,
  },
  nav: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: 24,
    rowGap: 8,
  },
  link: {
    color: { default: 'inherit', ':hover': colorVars['--color-text-primary'] },
    transitionProperty: 'color',
    transitionDuration: '150ms',
  },
  author: {
    color: {
      default: colorVars['--color-text-secondary'],
      ':hover': colorVars['--color-text-primary'],
    },
  },
  note: {
    marginTop: 24,
    fontSize: 'inherit',
    color: 'inherit',
  },
});
