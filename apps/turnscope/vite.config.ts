import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
  plugins: lazyPlugins(() => [
    cloudflare({ inspectorPort: 0 }),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false, autoSubfolderIndex: false },
    }),
    react(),
  ]),
  resolve: { tsconfigPaths: true },
  server: { port: 5174, strictPort: true },
});
