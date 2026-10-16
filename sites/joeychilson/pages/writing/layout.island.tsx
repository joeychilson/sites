import * as stylex from '@stylexjs/stylex';
import { useShared } from '@void/react';
import type { ReactNode } from 'react';

import { formatDay } from '../../src/dates';
import { text } from '../../src/styles/text';

export default function PostLayout({ children }: { children: ReactNode }) {
  const { post } = useShared();
  if (!post) {
    throw new Error('Pages under writing/ must be Markdown posts.');
  }

  return (
    <article {...stylex.props(styles.article)}>
      <header>
        <h1 {...stylex.props(text.title)}>
          <span {...stylex.props(styles.named(`post-${post.slug}`))}>{post.title}</span>
        </h1>
        <p {...stylex.props(text.subtitle)}>
          <time dateTime={post.published}>{formatDay(post.published)}</time>
          {post.updated && (
            <>
              {' '}
              (updated <time dateTime={post.updated}>{formatDay(post.updated)}</time>)
            </>
          )}
        </p>
      </header>
      <div {...stylex.props(styles.body)}>
        <div className="prose">{children}</div>
      </div>
    </article>
  );
}

const styles = stylex.create({
  article: {
    marginTop: 64,
  },
  named: (name: string) => ({
    viewTransitionName: name,
  }),
  body: {
    marginTop: 32,
  },
});
