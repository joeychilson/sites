import inter from '@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2?url';
import {
  createRootRoute,
  HeadContent,
  Link,
  Scripts,
  ScriptOnce,
  useMatch,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';

import departureMono from '@/assets/departure-mono.woff2?url';
import { PageHeader } from '@/components/page-header';
import { Skyline } from '@/components/skyline';
import { site } from '@/lib/site';
import { restoreTheme } from '@/lib/theme';

import appCss from '@/styles/app.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'color-scheme', content: 'light dark' },
      { title: site.name },
      { name: 'description', content: site.description },
      { name: 'author', content: site.name },
      { property: 'og:site_name', content: site.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: site.name },
      { property: 'og:description', content: site.description },
      { property: 'og:image', content: `${site.origin}${site.card.path}` },
      { property: 'og:image:alt', content: site.card.alt },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'preload', href: inter, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      {
        rel: 'preload',
        href: departureMono,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'alternate', type: 'application/rss+xml', title: site.name, href: '/rss.xml' },
    ],
  }),
  shellComponent: Document,
  notFoundComponent: NotFound,
});

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ScriptOnce>{restoreTheme}</ScriptOnce>
        <HeadContent />
      </head>
      <body>
        <div className="mx-auto box-content max-w-135 px-6 pt-10 pb-24 sm:pt-20">
          <Header />
          <main>{children}</main>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

const name = 'mt-8 block w-fit font-pixel text-[33px]/[33px] tracking-normal';

function Header() {
  const isHome = useMatch({ from: '/', shouldThrow: false }) !== undefined;
  return (
    <header className="[view-transition-name:header]">
      <Skyline />
      {isHome ? (
        <h1 className={name}>{site.name}</h1>
      ) : (
        <Link to="/" className={`${name} transition-colors hover:text-ink-secondary`}>
          {site.name}
        </Link>
      )}
    </header>
  );
}

function NotFound() {
  return <PageHeader title="Not found">There’s nothing at this address.</PageHeader>;
}
