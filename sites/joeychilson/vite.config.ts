import stylex from '@stylexjs/unplugin';
import { voidMarkdown } from '@void/md/plugin';
import { voidReact } from '@void/react/plugin';
import { defineConfig } from 'vite-plus';
import { voidPlugin } from 'void';

import { cityDay, cityNight } from './src/styles/code-theme';

const markdown = voidMarkdown({
  shiki: {
    // Shiki takes theme objects as well as bundled theme names; Void's option type lists only names.
    themes: { light: cityDay, dark: cityNight } as unknown as { light: string; dark: string },
  },
});

export default defineConfig(({ mode }) => ({
  // Tests only need the Markdown page index; the Workers runtime doesn't run under Vitest.
  plugins:
    mode === 'test'
      ? [voidReact(), markdown]
      : [
          stylex.vite({
            // Astryx ships prebuilt StyleX classes with the default `x` prefix; ours must not collide.
            classNamePrefix: 'j',
            propertyValidationMode: 'throw',
            // The same browsers as cssTarget, so StyleX's own CSS pass keeps light-dark() native too.
            lightningcssOptions: {
              targets: { chrome: 123 << 16, firefox: 120 << 16, safari: (17 << 16) | (5 << 8) },
            },
          }),
          voidPlugin(),
          voidReact(),
          markdown,
        ],
  build: {
    // Astryx's themes rely on native light-dark() and @scope; keep Vite from lowering them.
    cssTarget: ['chrome123', 'firefox120', 'safari17.5'],
  },
}));
