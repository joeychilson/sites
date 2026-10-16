import stylex from '@stylexjs/unplugin';
import { voidReact } from '@void/react/plugin';
import { defineConfig } from 'vite-plus';
import { voidPlugin } from 'void';

// Astryx's themes need native light-dark() and @scope, so neither Vite nor StyleX may lower CSS
// below these browsers.
const browsers = { chrome: [123, 0], firefox: [120, 0], safari: [17, 5] } as const;
const entries = Object.entries(browsers);

export default defineConfig(({ mode }) => ({
  // Tests run the server modules on their own, outside the Workers runtime.
  plugins:
    mode === 'test'
      ? []
      : [
          stylex.vite({
            // Astryx ships prebuilt StyleX classes with the default `x` prefix; ours must not collide.
            classNamePrefix: 't',
            propertyValidationMode: 'throw',
            lightningcssOptions: {
              targets: Object.fromEntries(
                entries.map(([browser, [major, minor]]) => [browser, (major << 16) | (minor << 8)]),
              ),
            },
          }),
          voidPlugin(),
          voidReact(),
        ],
  build: {
    cssTarget: entries.map(([browser, [major, minor]]) =>
      minor ? `${browser}${major}.${minor}` : `${browser}${major}`,
    ),
  },
}));
