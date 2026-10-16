import { createFileRoute } from '@tanstack/react-router';

import { LinkList } from '@/components/link-list';
import { formatMonth } from '@/lib/dates';
import { getPosts } from '@/lib/posts.functions';
import { site } from '@/lib/site';

export const Route = createFileRoute('/')({
  loader: () => getPosts(),
  head: () => ({
    meta: [{ property: 'og:url', content: `${site.origin}/` }],
    links: [{ rel: 'canonical', href: `${site.origin}/` }],
  }),
  component: Home,
});

function Home() {
  const posts = Route.useLoaderData();

  return (
    <>
      <nav aria-label="Elsewhere" className="mt-4 flex gap-5 text-ink-secondary motion-safe:rise-0">
        {site.profiles.map((profile) => (
          <a key={profile.href} href={profile.href} rel="me" className="link">
            {profile.label}
          </a>
        ))}
        <a href={`mailto:${site.email}`} className="link">
          Email
        </a>
      </nav>

      <section aria-labelledby="projects" className="mt-16 motion-safe:rise-1">
        <h2 id="projects" className="text-ink-faint">
          Projects
        </h2>
        <LinkList items={site.projects} stacksNote />
      </section>

      {posts.length > 0 && (
        <section aria-labelledby="writing" className="mt-12 motion-safe:rise-2">
          <div className="flex items-baseline justify-between">
            <h2 id="writing" className="text-ink-faint">
              Writing
            </h2>
            <a href="/rss.xml" className="text-ink-faint transition-colors hover:text-ink">
              RSS
            </a>
          </div>
          <LinkList
            items={posts.map((post) => ({
              slug: post.slug,
              title: post.title,
              note: post.isDraft ? 'Draft' : formatMonth(post.date),
            }))}
          />
        </section>
      )}
    </>
  );
}
