import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { type Account, inUse, notUsed, usedThisWeek, verdict } from '../../demo';
import { media, motion, tokens } from '../../styles/tokens.stylex';
import Glyph from '../glyph';
import AccountRow from './account-row';
import Collapse from './collapse';
import { row } from './styles';

type PanelProps = {
  /** The account shown open when the panel appears. */
  initialOpenId: string | null;
};

/** The app's panel (macos/Turnscope/Panel/Window.swift), working: rows open, and the rest fold out. */
export default function Panel({ initialOpenId }: PanelProps) {
  const [openId, setOpenId] = useState(initialOpenId);
  const [showsMore, setShowsMore] = useState(false);

  const accountRow = (account: Account) => (
    <span key={account.id} {...stylex.props(styles.item)}>
      <AccountRow
        account={account}
        isOpen={openId === account.id}
        onToggle={() => setOpenId(openId === account.id ? null : account.id)}
      />
    </span>
  );

  const toggleMore = () => {
    // Folding the rest away closes whichever of them was open.
    if (showsMore && notUsed.some(({ id }) => id === openId)) setOpenId(null);
    setShowsMore(!showsMore);
  };

  return (
    <div {...stylex.props(styles.panel)}>
      <div {...stylex.props(styles.verdict)}>
        <p {...stylex.props(styles.headline)}>{verdict.headline}</p>
        <p {...stylex.props(styles.detail)}>{verdict.detail}</p>
      </div>

      <div {...stylex.props(styles.lists)}>
        <span {...stylex.props(styles.group)}>{inUse.map(accountRow)}</span>
        <span {...stylex.props(styles.group, styles.later)}>
          <span {...stylex.props(styles.sectionTitle)}>Used this week</span>
          {usedThisWeek.map(accountRow)}
        </span>
        <span {...stylex.props(styles.item)}>
          <button
            type="button"
            aria-expanded={showsMore}
            onClick={toggleMore}
            {...stylex.props(row.padding, row.hover, styles.fold)}
          >
            <span {...stylex.props(styles.foldLabel)}>{`${notUsed.length} more accounts`}</span>
            <span {...stylex.props(styles.chevron, showsMore && styles.chevronOpen)}>
              <Glyph name="chevron" />
            </span>
          </button>
          <Collapse isOpen={showsMore}>
            <span {...stylex.props(styles.group)}>{notUsed.map(accountRow)}</span>
          </Collapse>
        </span>
      </div>

      {/* Its icons line up with the rows' edges, as close to the panel's corner as the rows are to its side. */}
      <div aria-hidden="true" {...stylex.props(styles.footer)}>
        <span {...stylex.props(styles.icon)}>
          <Glyph name="gearshape" />
        </span>
        <span {...stylex.props(styles.icon)}>
          <Glyph name="power" />
        </span>
      </div>
    </div>
  );
}

const styles = stylex.create({
  panel: {
    width: 340,
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: tokens.glass,
    backdropFilter: 'blur(30px) saturate(1.5)',
    boxShadow: tokens.shadowPanel,
    color: tokens.label,
    letterSpacing: 'normal',
    textAlign: 'start',
    WebkitFontSmoothing: 'auto',
    userSelect: 'none',
    cursor: 'default',
  },
  verdict: {
    paddingInline: 20,
    paddingTop: 18,
    paddingBottom: 14,
  },
  headline: {
    fontSize: 20,
    lineHeight: '24px',
    fontWeight: 600,
    color: colorVars['--color-warning'],
  },
  detail: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: '16px',
    color: tokens.labelSecondary,
  },
  // Each item keeps the app's 4 points between rows above it; the lists start that much higher, so
  // the first row sits right under the headline.
  lists: {
    marginTop: -4,
    paddingInline: 8,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    display: 'block',
    paddingTop: 4,
  },
  // With the heading's own 4 points, 12 under the accounts in use.
  later: {
    paddingTop: 8,
  },
  sectionTitle: {
    paddingTop: 4,
    paddingInline: 12,
    paddingBottom: 4,
    fontSize: 11,
    lineHeight: '14px',
    fontWeight: 600,
    color: tokens.labelSecondary,
  },
  fold: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    cursor: 'default',
    outlineOffset: -2,
  },
  foldLabel: {
    flexGrow: 1,
    textAlign: 'start',
    fontSize: 12,
    lineHeight: '15px',
    color: tokens.labelSecondary,
  },
  chevron: {
    display: 'flex',
    color: tokens.labelTertiary,
    transitionProperty: 'rotate',
    transitionDuration: { default: motion.spring, [media.reducedMotion]: '0s' },
    transitionTimingFunction: tokens.easeSpring,
  },
  chevronOpen: {
    rotate: '90deg',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2,
    padding: 8,
  },
  icon: {
    display: 'grid',
    placeItems: 'center',
    width: 28,
    height: 28,
    color: tokens.labelSecondary,
  },
});
