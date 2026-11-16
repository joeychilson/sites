import { cloudflareTest } from '@cloudflare/vitest-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [tanstackStart(), react(), cloudflareTest({ experimental: { newConfig: true } })],
  resolve: { tsconfigPaths: true },
  test: {
    include: ['test/**/*.test.ts'],
    testTimeout: 60_000,
    fsModuleCache: false,
  },
});
