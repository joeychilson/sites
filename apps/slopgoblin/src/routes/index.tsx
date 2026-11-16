import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import panelDark from '@/assets/panel-dark.webp';
import panelLight from '@/assets/panel-light.webp';
import { LiveFeed } from '@/components/demo/live-feed';
import { PillLink } from '@/components/pill-link';
import { site } from '@/lib/site';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ property: 'og:url', content: `${site.origin}/` }],
    links: [{ rel: 'canonical', href: `${site.origin}/` }],
  }),
  component: Home,
});

/** Every part of the page: words on the left, the thing itself on the right. */
const row =
  'column grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]';

const title = 'heading text-[38px]/[1] sm:text-[48px]/[1]';

function Home() {
  return (
    <>
      <section aria-labelledby="hero-title" className={`${row} items-center pt-8 pb-12 lg:pt-4`}>
        <div className="max-lg:pt-4">
          <h1
            id="hero-title"
            className="heading text-[46px]/[0.95] motion-safe:settle-0 sm:text-[68px]/[0.93] xl:text-[76px]/[0.93]"
          >
            Eats the junk in your X feed
          </h1>
          <p className="mt-6 max-w-[24em] text-[19px]/[1.5] text-pretty motion-safe:settle-1 sm:text-[21px]">
            A Chrome extension that hides AI slop, ragebait, clickbait and other junk as you scroll
            X.
          </p>
          <div className="mt-9 motion-safe:settle-2">
            <PillLink href={site.store} tone="ground" size="large">
              Add to Chrome
            </PillLink>
            <p className="mt-4 text-[14px]">
              Free and open source. Works with a free Gemini API key.
            </p>
          </div>
        </div>
        <LiveFeed />
      </section>

      {/* The cream sheet on the green, as in the side panel. */}
      <div className="rounded-[32px] bg-sheet text-ink [--color-focus:var(--color-accent)] sm:rounded-[48px]">
        <section aria-labelledby="panel-title" className={`${row} items-center pt-20 sm:pt-28`}>
          <div>
            <h2 id="panel-title" className={title}>
              See what it hid, and why
            </h2>
            <p className="mt-5 max-w-[26em] text-[18px]/[1.55] text-pretty text-ink-2">
              The side panel lists the posts it hid lately, with the reason. Choose how strict it
              is, and let through any post it got wrong.
            </p>
          </div>
          <picture className="mx-auto block w-full max-w-[360px] lg:me-0">
            <source srcSet={panelDark} media="(prefers-color-scheme: dark)" />
            <img
              src={panelLight}
              width={360}
              height={564}
              alt="The Slop Goblin side panel. The goblin peeks over a list of hidden posts, each with its reason: clickbait, grift, engagement bait and ragebait. Above the list, strictness is set to Balanced."
              className="w-full rounded-[24px] ring-1 ring-line"
            />
          </picture>
        </section>

        <section aria-labelledby="setup-title" className={`${row} pt-24 pb-20 sm:pt-32 sm:pb-28`}>
          <div>
            <h2 id="setup-title" className={title}>
              Set up in a minute
            </h2>
            <ol className="mt-8 grid max-w-[30em] gap-5 text-[18px]/[1.5] text-pretty text-ink-2">
              <Step n={1}>Add Slop Goblin to Chrome.</Step>
              <Step n={2}>
                Get a Gemini API key from <TextLink href={site.apiKey}>Google AI Studio</TextLink>.
              </Step>
              <Step n={3}>
                Click the goblin in Chrome’s extensions menu, paste the key, and scroll X.
              </Step>
            </ol>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <PillLink href={site.store} tone="primary" size="large">
                Add to Chrome
              </PillLink>
              <p className="text-[14px] text-muted">Needs Chrome 123 or later.</p>
            </div>
          </div>
          <dl className="grid content-start gap-9 text-[16px]/[1.6] text-ink-2 lg:pt-[72px]">
            <div>
              <dt className="font-display text-[19px] font-bold text-ink">What it sends</dt>
              <dd className="mt-1.5">
                Posts you scroll past go to Google to be checked, with your key, and nowhere else.
                Google is never asked about your own posts or people you follow. With a free key,
                Google may use what it receives to improve its products.{' '}
                <TextLink href={`${site.repo}/blob/main/PRIVACY.md`}>Privacy policy</TextLink>
              </dd>
            </div>
            <div>
              <dt className="font-display text-[19px] font-bold text-ink">What it costs</dt>
              <dd className="mt-1.5">
                Nothing with a free key. A paid key costs about 8¢ per 1,000 posts.
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-4">
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-full bg-fill font-display text-[14px] font-extrabold text-on-fill tabular-nums"
      >
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
    >
      {children}
    </a>
  );
}
