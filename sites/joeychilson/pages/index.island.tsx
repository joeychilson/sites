import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import LinkList from '../src/components/link-list' with { island: 'idle' };
import { formatMonth } from '../src/dates';
import { site } from '../src/site';
import { text } from '../src/styles/text';
import type { Props } from './index.server';

const projects = [
  { href: 'https://turnscope.app', title: 'Turnscope', meta: 'Menu bar app for Mac' },
  {
    href: 'https://github.com/joeychilson?tab=repositories&q=railway',
    title: 'Railway templates',
    meta: 'One-click deploys',
  },
];

export default function Home({ posts }: Props) {
  return (
    <>
      <nav aria-label="Elsewhere" {...stylex.props(styles.elsewhere)}>
        {site.profiles.map((profile) => (
          <a key={profile.href} href={profile.href} rel="me" {...stylex.props(text.link)}>
            {profile.label}
          </a>
        ))}
        <a href={`mailto:${site.email}`} {...stylex.props(text.link)}>
          Email
        </a>
      </nav>

      <section aria-labelledby="projects" {...stylex.props(styles.projects)}>
        <h2 id="projects" {...stylex.props(styles.heading)}>
          Projects
        </h2>
        <LinkList links={projects} stacksMeta />
      </section>

      {posts.length > 0 && (
        <section aria-labelledby="writing" {...stylex.props(styles.writing)}>
          <div {...stylex.props(styles.headingRow)}>
            <h2 id="writing" {...stylex.props(styles.heading)}>
              Writing
            </h2>
            <a href="/rss.xml" {...stylex.props(styles.quietLink)}>
              RSS
            </a>
          </div>
          <LinkList
            links={posts.map((post) => ({
              href: post.path,
              title: post.title,
              meta: post.draft ? 'Draft' : formatMonth(post.date),
              transitionName: post.transitionName,
            }))}
          />
        </section>
      )}
    </>
  );
}

const styles = stylex.create({
  elsewhere: {
    display: 'flex',
    gap: 20,
    marginTop: 16,
    color: colorVars['--color-text-secondary'],
  },
  projects: {
    marginTop: 64,
  },
  writing: {
    marginTop: 48,
  },
  headingRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    color: colorVars['--color-text-disabled'],
  },
  quietLink: {
    color: {
      default: colorVars['--color-text-disabled'],
      ':hover': colorVars['--color-text-primary'],
    },
    transitionProperty: 'color',
    transitionDuration: '150ms',
  },
});
