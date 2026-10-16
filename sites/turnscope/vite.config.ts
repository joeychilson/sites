import stylex from '@stylexjs/unplugin';
import { voidReact } from '@void/react/plugin';
import { defineConfig } from 'vite-plus';
import { voidPlugin } from 'void';

export default defineConfig(({ mode }) => ({
  // Tests cover server modules on their own; the Workers runtime doesn't run under Vitest.
  plugins:
    mode === 'test'
      ? []
      : [
          stylex.vite({
            // Astryx ships prebuilt StyleX classes with the default `x` prefix; ours must not collide.
            classNamePrefix: 't',
            propertyValidationMode: 'throw',
            // The same browsers as cssTarget, so StyleX's own CSS pass doesn't lower modern CSS either.
            lightningcssOptions: {
              targets: { chrome: 123 << 16, firefox: 120 << 16, safari: (17 << 16) | (5 << 8) },
            },
          }),
          voidPlugin(),
          voidReact(),
        ],
  build: {
    // Astryx's themes rely on native light-dark() and @scope; keep Vite from lowering them.
    cssTarget: ['chrome123', 'firefox120', 'safari17.5'],
  },
}));
