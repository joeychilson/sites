import { defineConfig } from 'void/config';

import { site } from './src/site';

// Runs before first paint so a saved day/night choice never flashes the other theme.
const RESTORE_THEME = `try{const t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}`;

// In builds StyleX writes into the bundled CSS; in dev it serves its rules from these virtual modules.
const dev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  output: 'static',
  head: {
    title: site.name,
    htmlAttrs: { lang: 'en', 'data-astryx-theme': 'city' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'color-scheme', content: 'light dark' },
      { name: 'description', content: site.description },
      { name: 'author', content: site.name },
      { property: 'og:site_name', content: site.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: site.name },
      { property: 'og:description', content: site.description },
      { property: 'og:image', content: `${site.url}${site.image}` },
      { property: 'og:image:alt', content: site.imageAlt },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'alternate', type: 'application/rss+xml', title: site.name, href: '/rss.xml' },
      ...(dev ? [{ rel: 'stylesheet', href: '/virtual:stylex.css' }] : []),
    ],
    script: [
      { innerHTML: RESTORE_THEME },
      ...(dev ? [{ type: 'module', src: '/@id/virtual:stylex:runtime' }] : []),
    ],
  },
  routing: {
    notFound: '404-page',
    // joeychilson.dev reaches the same Worker; send it to the same path on the site's own domain.
    redirects: {
      'https://joeychilson.dev/*': { to: `${site.url}/:splat`, status: 301 },
    },
    headers: {
      '/*': [
        'X-Content-Type-Options: nosniff',
        'Referrer-Policy: strict-origin-when-cross-origin',
        'X-Frame-Options: DENY',
      ],
    },
  },
});
