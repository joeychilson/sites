import { defineConfig } from 'cf/config';

import * as entrypoint from './src/server.ts' with { type: 'cf-worker' };

export default defineConfig({
  worker: {
    name: 'joeychilson',
    compatibilityDate: '2026-10-19',
    entrypoint,
    domains: ['joeychilson.com', 'joeychilson.dev'],
    workersDev: false,
    observability: { enabled: true },
  },
});
