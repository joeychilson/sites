import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { media, motion, tokens } from '../../../styles/tokens.stylex';
import { useHeightTransition } from '../../../use-height-transition';
import FirstPage from './first-page';
import SettingsPage from './settings-page';

type PanelProps = {
  /** The account open when it first shows. */
  initialOpenId: string | null;
  /** The accounts hidden from the menu bar and the panel, which Show and Settings change. */
  hiddenIds: Array<string>;
  onHide: (id: string, isHidden: boolean) => void;
};

type Page = 'first' | 'settings';

/**
 * The app's panel, its pages side by side: going to Settings, it comes in from the right; going
 * back, the first page comes in from the left. The panel's height follows the page on the spring.
 */
export default function Panel({ initialOpenId, hiddenIds, onHide }: PanelProps) {
  const [page, setPage] = useState<Page>('first');
  // A page that leaves is taken out of the flow, so the panel would jump to the new page's height.
  const [pages, measurePages] = useHeightTransition<HTMLDivElement>(page);

  const go = (to: Page) => {
    measurePages();
    setPage(to);
  };

  return (
    <div {...stylex.props(styles.panel)}>
      <div ref={pages} {...stylex.props(styles.pages)}>
        <div
          inert={page !== 'first'}
          {...stylex.props(styles.page, page === 'first' ? styles.current : styles.left)}
        >
          <FirstPage
            initialOpenId={initialOpenId}
            hiddenIds={hiddenIds}
            onHide={onHide}
            onSettings={() => go('settings')}
          />
        </div>
        <div
          inert={page !== 'settings'}
          {...stylex.props(styles.page, page === 'settings' ? styles.current : styles.right)}
        >
          <SettingsPage hiddenIds={hiddenIds} onHide={onHide} onBack={() => go('first')} />
        </div>
      </div>
    </div>
  );
}

// The app's panel (macos/Turnscope/Panel/Window.swift): 340 points wide, the popover's glass, a
// half-point edge and a 14-point corner.
const styles = stylex.create({
  panel: {
    width: 340,
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: tokens.glass,
    backdropFilter: 'blur(30px) saturate(1.5)',
    boxShadow:
      'inset 0 0 0 0.5px rgb(255 255 255 / 0.12), inset 0 1px 0 rgb(255 255 255 / 0.08), 0 8px 36px rgb(0 0 0 / 0.45)',
    color: tokens.label,
    letterSpacing: 'normal',
    textAlign: 'start',
    WebkitFontSmoothing: 'auto',
    userSelect: 'none',
    cursor: 'default',
  },
  pages: {
    position: 'relative',
    overflow: 'hidden',
  },
  page: {
    transitionProperty: 'translate, opacity, visibility',
    transitionDuration: `${motion.spring}, ${motion.spring}, 0s`,
    transitionTimingFunction: tokens.easeSpring,
  },
  current: {
    position: 'relative',
    opacity: 1,
    visibility: 'inherit',
    transitionDelay: '0s',
  },
  // A page off to the side leaves the flow, fades as it slides, and hides once it has gone.
  left: {
    position: 'absolute',
    insetInline: 0,
    top: 0,
    translate: { default: '-100% 0', [media.reducedMotion]: 'none' },
    opacity: 0,
    visibility: 'hidden',
    transitionDelay: `0s, 0s, ${motion.spring}`,
  },
  right: {
    position: 'absolute',
    insetInline: 0,
    top: 0,
    translate: { default: '100% 0', [media.reducedMotion]: 'none' },
    opacity: 0,
    visibility: 'hidden',
    transitionDelay: `0s, 0s, ${motion.spring}`,
  },
});
