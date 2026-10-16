import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { inUse } from '../demo';
import { a11y } from '../styles/a11y';
import { media, tokens } from '../styles/tokens.stylex';
import Glyph from './glyph';
import MenuBarItem from './panel/menu-bar-item';
import Panel from './panel/panel';
import Terminal, { Turn } from './terminal';

const WIDTH = 1120;
const HEIGHT = 740;
// A page shows one screen, so a fixed id is unique.
const PANEL_ID = 'turnscope-panel';

/** A Mac's screen: Claude Code checking its limits, and Turnscope's panel open from the menu bar. */
export default function HeroScreen() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  // Each opening is a new panel with nothing open, as in the app. The first shows an account open,
  // so the page shows its limits.
  const [opening, setOpening] = useState(0);

  const toggle = () => {
    if (!isPanelOpen) setOpening(opening + 1);
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <figure {...stylex.props(styles.frame)}>
      <figcaption {...stylex.props(a11y.visuallyHidden)}>
        A Mac at 7 AM. Asked to use subagents, Claude Code asks Turnscope whether 2 hours of work
        fit. About 1 hour 10 minutes of work is left before its 5-hour limit runs out, so it writes
        the tests itself. Turnscope's panel, open from the menu bar, says Claude Max runs out in 1
        hour and is back in 3, and shows each of its limits.
      </figcaption>
      <div {...stylex.props(styles.screen)}>
        <div {...stylex.props(styles.menuBar)}>
          <span aria-hidden="true" {...stylex.props(styles.menus)}>
            <span {...stylex.props(styles.menu, styles.app)}>Terminal</span>
            {['Shell', 'Edit', 'View'].map((menu) => (
              <span key={menu} {...stylex.props(styles.menu)}>
                {menu}
              </span>
            ))}
          </span>
          <span {...stylex.props(styles.spacer)} />
          <button
            type="button"
            aria-label="Turnscope"
            aria-expanded={isPanelOpen}
            aria-controls={PANEL_ID}
            onClick={toggle}
            {...stylex.props(styles.menu, styles.item, isPanelOpen && styles.itemOpen)}
          >
            {inUse.map((account) => (
              <MenuBarItem
                key={account.id}
                logo={account.logo}
                figure={account.menuBarFigure ?? account.figure}
                standing={account.standing}
              />
            ))}
          </button>
          <span aria-hidden="true" {...stylex.props(styles.menu, styles.glyph)}>
            <Glyph name="wifi" />
          </span>
          <span aria-hidden="true" {...stylex.props(styles.menu, styles.glyph)}>
            <Glyph name="controls" />
          </span>
          <span aria-hidden="true" {...stylex.props(styles.menu, styles.clock, styles.wideOnly)}>
            Thu Oct 8 7:00 AM
          </span>
        </div>
        <div {...stylex.props(styles.terminal, styles.wideOnly)}>
          <Terminal title="app — claude">
            <Turn mark=">" isMuted>
              Use subagents to write the parser's tests.
            </Turn>
            <Turn mark="●">
              <strong>turnscope - check_limits</strong> (MCP)(hours: 2)
            </Turn>
            <Turn mark="⎿" isOutput>
              2 more hours of work don't fit: 5 hours runs out after about 1h 10m of work.
              <br />
              Claude Max (me@example.com): about 1h 10m of work left (40m–2h 10m) before 5 hours
              runs out; it resets 10:00 (in 3h).
              <br />
              <span {...stylex.props(styles.faint)}>… +5 lines (ctrl+o to expand)</span>
            </Turn>
            <Turn mark="●">
              That's about an hour of work, too little for subagents. I'll write the tests myself.
            </Turn>
          </Terminal>
        </div>
        <div
          id={PANEL_ID}
          inert={!isPanelOpen}
          {...stylex.props(styles.panel, isPanelOpen ? styles.shown : styles.hidden)}
        >
          <Panel key={opening} initialOpenId={opening === 0 ? 'claude' : null} />
        </div>
      </div>
    </figure>
  );
}

const styles = stylex.create({
  frame: {
    containerType: 'inline-size',
    width: '100%',
    maxWidth: WIDTH,
    marginInline: 'auto',
  },
  screen: {
    position: 'relative',
    overflow: 'hidden',
    width: { default: WIDTH, [media.narrow]: 'auto' },
    height: { default: HEIGHT, [media.narrow]: 'auto' },
    paddingBottom: { default: 0, [media.narrow]: 32 },
    // tan(atan2(a, b)) divides two lengths into a plain number, so the screen zooms to fit its frame.
    zoom: { default: `min(1, tan(atan2(100cqw, ${WIDTH}px)))`, [media.narrow]: 1 },
    borderRadius: 22,
    backgroundImage: [
      'radial-gradient(60% 55% at 78% 18%, rgb(237 148 25 / 0.14), transparent 70%)',
      'radial-gradient(70% 70% at 18% 82%, rgb(120 120 132 / 0.35), transparent 70%)',
      'radial-gradient(90% 80% at 60% 60%, rgb(70 70 78 / 0.6), transparent 75%)',
      'linear-gradient(160deg, #2a2a30, #0e0e11)',
    ].join(', '),
    boxShadow: '0 0 0 0.5px rgb(255 255 255 / 0.12), 0 40px 120px rgb(0 0 0 / 0.6)',
  },
  menuBar: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    height: 32,
    paddingInline: 10,
    backgroundColor: 'rgb(0 0 0 / 0.2)',
    backdropFilter: 'blur(12px)',
    color: tokens.label,
    fontSize: 13,
    letterSpacing: 'normal',
    cursor: 'default',
  },
  menus: {
    display: { default: 'flex', [media.narrow]: 'none' },
    gap: 4,
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    paddingInline: 8,
  },
  app: {
    fontWeight: 700,
  },
  glyph: {
    paddingInline: 6,
  },
  wideOnly: {
    display: { default: null, [media.narrow]: 'none' },
  },
  spacer: {
    flexGrow: 1,
  },
  item: {
    height: 24,
    borderRadius: 6,
    cursor: 'default',
    transitionProperty: 'background-color',
    transitionDuration: '100ms',
  },
  itemOpen: {
    backgroundColor: 'rgb(255 255 255 / 0.18)',
  },
  clock: {
    fontVariantNumeric: 'tabular-nums',
  },
  terminal: {
    position: 'absolute',
    top: 156,
    left: 56,
    width: 560,
  },
  // Centered under the item and 6 points below the menu bar, where the app puts it.
  panel: {
    position: { default: 'absolute', [media.narrow]: 'static' },
    top: 38,
    right: 73,
    display: { default: null, [media.narrow]: 'flex' },
    justifyContent: 'center',
    paddingInline: { default: 0, [media.narrow]: 12 },
    paddingTop: { default: 0, [media.narrow]: 8 },
    transitionProperty: 'opacity, visibility',
  },
  shown: {
    opacity: 1,
    visibility: 'visible',
    transitionDuration: '140ms, 0s',
  },
  hidden: {
    opacity: 0,
    visibility: 'hidden',
    transitionDuration: '100ms, 0s',
    transitionDelay: '0s, 100ms',
  },
  faint: {
    color: colorVars['--color-text-disabled'],
  },
});
