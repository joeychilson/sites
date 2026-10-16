import { createFileRoute } from '@tanstack/react-router';

import { PageHeader } from '@/components/page-header';
import { PostBody } from '@/components/post-body';
import { formatDay } from '@/lib/dates';
import { getPost } from '@/lib/posts.functions';
import { site } from '@/lib/site';

export const Route = createFileRoute('/writing/$slug')({
  loader: ({ params }) => getPost({ data: { slug: params.slug } }),
  head: ({ loaderData: post }) => {
    if (!post) {
      return {};
    }
    const url = `${site.origin}/writing/${post.slug}`;
    return {
      meta: [
        { title: `${post.title} · ${site.name}` },
        { name: 'description', content: post.description },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.description },
        { property: 'og:url', content: url },
        { property: 'article:published_time', content: post.date },
        ...(post.updated ? [{ property: 'article:modified_time', content: post.updated }] : []),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: Post,
});

function Post() {
  const post = Route.useLoaderData();

  return (
    <article>
      <PageHeader title={post.title} style={{ viewTransitionName: `post-${post.slug}` }}>
        {post.isDraft && 'Draft · '}
        <time dateTime={post.date}>{formatDay(post.date)}</time>
        {post.updated && (
          <>
            {' · Updated '}
            <time dateTime={post.updated}>{formatDay(post.updated)}</time>
          </>
        )}
      </PageHeader>
      <PostBody body={post.body} />
    </article>
  );
}
