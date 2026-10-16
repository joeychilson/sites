import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { formatMonth } from '../src/dates';
import Rows from '../src/islands/rows' with { island: 'idle' };
import { posts } from '../src/posts';
import { site } from '../src/site';
import { text } from '../src/styles/text';

const projects = [
  { href: 'https://turnscope.app', title: 'Turnscope', meta: 'Menu bar app for Mac' },
  {
    href: 'https://github.com/joeychilson?tab=repositories&q=railway',
    title: 'Railway templates',
    meta: 'One-click deploys',
  },
];

export default function Home() {
  return (
    <>
      <nav aria-label="Elsewhere" {...stylex.props(styles.elsewhere)}>
        {site.profiles.map((profile) => (
          <a key={profile.href} href={profile.href} rel="me" {...stylex.props(styles.link)}>
            {profile.label}
          </a>
        ))}
        <a href={`mailto:${site.email}`} {...stylex.props(styles.link)}>
          Email
        </a>
      </nav>

      <section aria-labelledby="projects" {...stylex.props(styles.projects)}>
        <h2 id="projects" {...stylex.props(styles.heading, text.quiet)}>
          Projects
        </h2>
        <div {...stylex.props(styles.rows)}>
          <Rows rows={projects} isStacked />
        </div>
      </section>

      {posts.length > 0 && (
        <section aria-labelledby="writing" {...stylex.props(styles.writing)}>
          <div {...stylex.props(styles.sectionHeader)}>
            <h2 id="writing" {...stylex.props(styles.heading, text.quiet)}>
              Writing
            </h2>
            <a href="/rss.xml" {...stylex.props(styles.quietLink)}>
              RSS
            </a>
          </div>
          <div {...stylex.props(styles.rows)}>
            <Rows
              rows={posts.map((post) => ({
                href: post.path,
                title: post.title,
                meta: formatMonth(post.published),
                transitionName: `post-${post.slug}`,
              }))}
            />
          </div>
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
  sectionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
  },
  rows: {
    marginTop: 8,
  },
  /** A link in a sentence: the text's own color, over a faint line that darkens under the pointer. */
  link: {
    textDecorationLine: 'underline',
    textDecorationThickness: 1,
    textUnderlineOffset: 3,
    textDecorationColor: { default: colorVars['--color-border'], ':hover': 'currentColor' },
    transitionProperty: 'text-decoration-color',
    transitionDuration: '200ms',
  },
  /** A quiet link that brightens under the pointer. */
  quietLink: {
    color: {
      default: colorVars['--color-text-disabled'],
      ':hover': colorVars['--color-text-primary'],
    },
    transitionProperty: 'color',
    transitionDuration: '150ms',
  },
});
