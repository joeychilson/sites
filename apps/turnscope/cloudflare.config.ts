import { bindings, defineConfig } from 'cf/config';

import * as entrypoint from './src/server.ts' with { type: 'cf-worker' };

export default defineConfig({
  worker: {
    name: 'turnscope',
    compatibilityDate: '2026-10-19',
    entrypoint,
    domains: ['turnscope.app'],
    workersDev: false,
    observability: { enabled: true },
    env: {
      GITHUB_TOKEN: bindings.secret(),
    },
  },
});
