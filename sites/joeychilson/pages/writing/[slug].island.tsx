import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';

import CodeBlock from '../../src/components/code-block';
import CopyButton from '../../src/components/copy-button' with { island: 'visible' };
import PageHeader from '../../src/components/page-header';
import Prose from '../../src/components/prose';
import { formatDay } from '../../src/dates';
import type { Props } from './[slug].server';

// Islands can only be marked in a page, so the copy button joins the code block here.
function CopyableCodeBlock({
  code,
  ...props
}: ComponentProps<typeof CodeBlock> & { code: string }) {
  return <CodeBlock {...props} action={<CopyButton value={code} />} />;
}

export default function Post({ post, nodes }: Props) {
  return (
    <article>
      <PageHeader
        title={<span {...stylex.props(styles.named(post.transitionName))}>{post.title}</span>}
      >
        {post.draft && 'Draft · '}
        <time dateTime={post.date}>{formatDay(post.date)}</time>
        {post.updated && (
          <>
            {' '}
            (updated <time dateTime={post.updated}>{formatDay(post.updated)}</time>)
          </>
        )}
      </PageHeader>
      <div {...stylex.props(styles.body)}>
        <Prose nodes={nodes} components={{ pre: CopyableCodeBlock }} />
      </div>
    </article>
  );
}

const styles = stylex.create({
  named: (name: string) => ({
    viewTransitionName: name,
  }),
  body: {
    marginTop: 32,
  },
});
