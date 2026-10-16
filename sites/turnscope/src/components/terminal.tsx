import { colorVars, typographyVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import { tokens } from '../styles/tokens.stylex';

type TerminalProps = {
  title: string;
  children: ReactNode;
};

/** A terminal window showing an agent's turns. */
export default function Terminal({ title, children }: TerminalProps) {
  return (
    <div {...stylex.props(styles.window)}>
      <div {...stylex.props(styles.titleBar)}>
        <span {...stylex.props(styles.lights)} aria-hidden="true">
          <span {...stylex.props(styles.light, styles.close)} />
          <span {...stylex.props(styles.light, styles.minimize)} />
          <span {...stylex.props(styles.light, styles.zoom)} />
        </span>
        <span {...stylex.props(styles.title)}>{title}</span>
      </div>
      <div {...stylex.props(styles.body)}>{children}</div>
    </div>
  );
}

const styles = stylex.create({
  window: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: tokens.window,
    boxShadow: '0 0 0 0.5px rgb(255 255 255 / 0.14), 0 24px 70px rgb(0 0 0 / 0.55)',
    textAlign: 'start',
  },
  titleBar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: 36,
    paddingInline: 14,
  },
  lights: {
    display: 'flex',
    gap: 8,
  },
  light: {
    width: 12,
    height: 12,
    borderRadius: '50%',
  },
  close: { backgroundColor: '#ff5f57' },
  minimize: { backgroundColor: '#febc2e' },
  zoom: { backgroundColor: '#28c840' },
  title: {
    position: 'absolute',
    insetInline: 0,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 600,
    color: colorVars['--color-text-disabled'],
  },
  body: {
    paddingInline: 20,
    paddingBlock: '8px 24px',
    fontFamily: typographyVars['--font-family-code'],
    fontSize: 13,
    lineHeight: 1.65,
    letterSpacing: 'normal',
    color: colorVars['--color-text-primary'],
  },
});
