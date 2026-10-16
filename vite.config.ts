import { defineConfig } from 'vite-plus';

const apps = ['joeychilson', 'turnscope'];

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    singleQuote: true,
    printWidth: 100,
    sortImports: true,
    ignorePatterns: ['**/.cloudflare/**', '**/routeTree.gen.ts'],
    overrides: apps.map((app) => ({
      files: [`apps/${app}/**`],
      options: { sortTailwindcss: { stylesheet: `./apps/${app}/src/styles/app.css` } },
    })),
  },
  lint: {
    plugins: ['typescript', 'import', 'unicorn', 'oxc', 'react', 'jsx-a11y'],
    categories: { correctness: 'error' },
    rules: {
      'react/rules-of-hooks': 'error',
      'react/exhaustive-deps': 'error',
    },
    ignorePatterns: ['**/.cloudflare/**', '**/routeTree.gen.ts'],
    overrides: [{ files: ['**/*.test.ts'], plugins: ['vitest'] }],
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    tasks: {
      types: { command: 'vp run -r types', cache: false },
      ready: {
        command: ['vp run -r build', 'vp check', 'vp run -r test'],
        dependsOn: ['types'],
        cache: false,
      },
    },
  },
});
