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
      { name: 'color-scheme', content: 'dark' },
      { name: 'theme-color', content: '#000000' },
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
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
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
    <div className="px-6 pt-24 pb-10 text-center sm:pt-36">
      <p className="text-[15px] text-ink-faint tabular-nums">404</p>
      <h1 className="mt-3 headline">There’s no page here</h1>
      <p className="mx-auto mt-6 max-w-[28em] text-[18px] text-ink-secondary">
        Check the address, or head back home.
      </p>
      <div className="mt-10">
        <PillLink href="/" size="large">
          Go home
        </PillLink>
      </div>
    </div>
  );
}
