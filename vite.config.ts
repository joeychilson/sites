import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    singleQuote: true,
    printWidth: 100,
    sortImports: true,
    ignorePatterns: ['**/theme/built/**'],
  },
  lint: {
    plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'import', 'react', 'jsx-a11y'],
    ignorePatterns: ['**/theme/built/**'],
    rules: {
      'react/rules-of-hooks': 'error',
      'react/exhaustive-deps': 'error',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
    overrides: [
      {
        // Code that can reach the browser.
        files: ['**/components/**', '**/src/*.ts', '**/styles/**', '**/pages/**/*.tsx'],
        rules: {
          'no-restricted-imports': [
            'error',
            {
              paths: [
                {
                  name: 'react',
                  importNames: ['useId'],
                  message:
                    "Islands hydrate as their own React roots, so useId won't match the server's HTML. Derive the id from props.",
                },
              ],
              patterns: [
                {
                  group: ['**/server/**', 'void/db', 'void/kv', 'void/storage'],
                  message: 'Server-only. Reach it through a loader, action or route.',
                },
              ],
            },
          ],
        },
      },
    ],
    options: { typeAware: true, typeCheck: true },
  },
});
