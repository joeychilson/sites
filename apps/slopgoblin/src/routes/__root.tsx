import bricolage from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2?url';
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { PillLink } from '@/components/pill-link';
import { site } from '@/lib/site';

import appCss from '@/styles/app.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'color-scheme', content: 'light dark' },
      { title: site.name },
      { name: 'description', content: site.description },
      { property: 'og:site_name', content: site.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: site.name },
      { property: 'og:description', content: site.description },
      { property: 'og:image', content: `${site.origin}${site.card.path}` },
      { property: 'og:image:alt', content: site.card.alt },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'preload', href: bricolage, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
  }),
  shellComponent: Document,
  notFoundComponent: NotFound,
});

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Here, not in `head`: HeadContent keeps only one meta tag of each name. */}
        <meta name="theme-color" content="#547b1d" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1f2d11" media="(prefers-color-scheme: dark)" />
      </head>
      <body>
        <div className="flex min-h-dvh flex-col">
          <Header />
          <main id="main" className="grow">
            {children}
          </main>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="column pt-16 pb-24 sm:pt-24 sm:pb-32">
      <h1 className="heading text-[46px]/[0.96] sm:text-[68px]/[0.94]">Nothing here but crumbs</h1>
      <p className="mt-5 max-w-[28em] text-[18px]/[1.55]">
        The goblin couldn’t find that page. Check the address, or head back home.
      </p>
      <div className="mt-9">
        <PillLink href="/" tone="ground" size="large">
          Go home
        </PillLink>
      </div>
    </div>
  );
}
