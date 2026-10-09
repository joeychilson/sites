import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import adapter from '@sveltejs/adapter-bun';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, lazyPlugins } from 'vite-plus';

// The CSP allows the inline script in `app.html`, which applies a saved theme before the first paint, by its hash.
const html = readFileSync(new URL('src/app.html', import.meta.url), 'utf8');
const script = /<script>([\s\S]*?)<\/script>/.exec(html)![1];
const themeHash = `sha256-${createHash('sha256').update(script).digest('base64')}` as const;

export default defineConfig({
  plugins: lazyPlugins(() => [
    tailwindcss(),
    sveltekit({
      experimental: { remoteFunctions: true, forkPreloads: true },
      adapter: adapter({ precompress: true }),
      compilerOptions: {
        experimental: { async: true },
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
      },
      prerender: {
        handleUnseenRoutes: ({ routes, message }) => {
          if (routes.some((route) => route !== '/writing/[slug]')) throw new Error(message);
        },
      },
      csp: {
        mode: 'hash',
        directives: {
          'default-src': ['self'],
          'script-src': ['self', themeHash],
          'style-src': ['self', 'unsafe-inline'],
          'img-src': ['self', 'data:'],
          'font-src': ['self'],
          'connect-src': ['self'],
          'base-uri': ['self'],
          'form-action': ['self'],
          'object-src': ['none'],
        },
      },
    }),
  ]),
});
