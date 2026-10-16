import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import Glyph from '../../../components/glyph';
import Logo from '../../../components/logo';
import { media, motion, tokens } from '../../../styles/tokens.stylex';
import {
  type Account,
  accounts,
  hiddenVerdict,
  inUse,
  notUsed,
  usedThisWeek,
  verdict,
} from '../accounts';
import AccountRow from './account-row';
import Collapse from './collapse';
import IconButton from './icon-button';
import PillButton from './pill-button';

type FirstPageProps = {
  /** The account open when the panel first shows. */
  initialOpenId: string | null;
  hiddenIds: Array<string>;
  onHide: (id: string, isHidden: boolean) => void;
  onSettings: () => void;
};

type FoldProps = {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
};

/**
 * The panel's first page, from the top: whether you can keep going, the accounts in use, those
 * used this week, the rest folded into a line with the hidden ones last, and Settings. One account
 * at a time opens in place, wherever it's listed.
 */
export default function FirstPage({
  initialOpenId,
  hiddenIds,
  onHide,
  onSettings,
}: FirstPageProps) {
  const [openId, setOpenId] = useState(initialOpenId);
  const [isMoreShown, setIsMoreShown] = useState(false);
  const [isHiddenShown, setIsHiddenShown] = useState(false);
  const rowButtons = useRef(new Map<string, HTMLButtonElement>());

  const isShown = (account: Account) => !hiddenIds.includes(account.id);
  const hidden = accounts.filter((account) => !isShown(account));
  const unused = notUsed.filter(isShown);
  const isAnyInUse = inUse.some(isShown);
  const isAboveFold = isAnyInUse || usedThisWeek.some(isShown);
  const said = isAnyInUse ? verdict : hiddenVerdict;

  // Every account keeps its place, so hiding or showing one opens or closes its space.
  const row = (account: Account) => (
    <Collapse key={account.id} isOpen={isShown(account)}>
      <span {...stylex.props(styles.item)}>
        <AccountRow
          ref={(element) => {
            if (element) rowButtons.current.set(account.id, element);
          }}
          account={account}
          isOpen={openId === account.id}
          onToggle={() => setOpenId(openId === account.id ? null : account.id)}
        />
      </span>
    </Collapse>
  );

  // Folding the rest away closes whatever of it was open.
  const toggleMore = () => {
    if (isMoreShown && notUsed.some(({ id }) => id === openId)) setOpenId(null);
    setIsMoreShown(!isMoreShown);
    setIsHiddenShown(false);
  };

  // Showing an account moves it back to its list, and focus goes with it rather than to the page.
  const show = (id: string) => {
    flushSync(() => onHide(id, false));
    rowButtons.current.get(id)?.focus();
  };

  return (
    <>
      <div {...stylex.props(styles.verdict)}>
        <p {...stylex.props(styles.headline, isAnyInUse && styles.runningOut)}>{said.headline}</p>
        <p {...stylex.props(styles.detail)}>{said.detail}</p>
      </div>

      <div {...stylex.props(styles.lists)}>
        <span {...stylex.props(styles.group)}>{inUse.map(row)}</span>

        <Collapse isOpen={usedThisWeek.some(isShown)}>
          <span {...stylex.props(styles.group, isAnyInUse && styles.later)}>
            <span {...stylex.props(styles.sectionTitle)}>Used this week</span>
            {usedThisWeek.map(row)}
          </span>
        </Collapse>

        <span {...stylex.props(styles.item)}>
          <Fold
            label={
              unused.length > 0
                ? `${unused.length} ${isAboveFold ? 'more ' : ''}account${unused.length === 1 ? '' : 's'}`
                : `${hidden.length} hidden`
            }
            isOpen={isMoreShown}
            onToggle={toggleMore}
          />
          <Collapse isOpen={isMoreShown}>
            <span {...stylex.props(styles.group)}>
              {notUsed.map(row)}
              <Collapse isOpen={unused.length > 0 && hidden.length > 0}>
                <span {...stylex.props(styles.item)}>
                  <Fold
                    label={`${hidden.length} hidden`}
                    isOpen={isHiddenShown}
                    onToggle={() => setIsHiddenShown(!isHiddenShown)}
                  />
                </span>
              </Collapse>
              <Collapse isOpen={isHiddenShown || unused.length === 0}>
                <span {...stylex.props(styles.group)}>
                  {accounts.map((account) => (
                    <Collapse key={account.id} isOpen={!isShown(account)}>
                      <span {...stylex.props(styles.item)}>
                        <span {...stylex.props(styles.hiddenRow)}>
                          <Logo
                            name={account.logo}
                            width={18}
                            height={18}
                            {...stylex.props(styles.hiddenLogo)}
                          />
                          <span {...stylex.props(styles.hiddenNames)}>
                            <span {...stylex.props(styles.hiddenName)}>{account.name}</span>
                            <span {...stylex.props(styles.hiddenVia)}>{account.via}</span>
                          </span>
                          <PillButton
                            label={`Show ${account.name}`}
                            onClick={() => show(account.id)}
                          >
                            Show
                          </PillButton>
                        </span>
                      </span>
                    </Collapse>
                  ))}
                </span>
              </Collapse>
            </span>
          </Collapse>
        </span>
      </div>

      {/* Its buttons line up with the rows' edges, as close to the panel's corner as the rows are to its side. */}
      <div {...stylex.props(styles.footer)}>
        <IconButton label="Settings" onClick={onSettings}>
          <Glyph name="gearshape" />
        </IconButton>
        <span aria-hidden="true" {...stylex.props(styles.quit)}>
          <Glyph name="power" />
        </span>
      </div>
    </>
  );
}

/** A line that folds rows away: what it holds, and a chevron that turns as it opens. */
function Fold({ label, isOpen, onToggle }: FoldProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={onToggle}
      {...stylex.props(styles.foldLine)}
    >
      <span {...stylex.props(styles.foldLabel)}>{label}</span>
      <span {...stylex.props(styles.chevron, isOpen && styles.chevronOpen)}>
        <Glyph name="chevron" />
      </span>
    </button>
  );
}

const styles = stylex.create({
  verdict: {
    paddingInline: 20,
    paddingTop: 18,
    paddingBottom: 14,
  },
  headline: {
    fontSize: 20,
    lineHeight: '24px',
    fontWeight: 600,
  },
  runningOut: {
    color: colorVars['--color-warning'],
  },
  detail: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: '16px',
    color: tokens.labelSecondary,
  },
  // Each item keeps 4 points above it, the app's space between rows; the lists start that much
  // higher so the first row sits right under the headline.
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
  foldLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    paddingBlock: 7,
    paddingInline: 12,
    borderRadius: 10,
    backgroundColor: { default: 'transparent', ':hover': tokens.rowHover },
    cursor: 'default',
    transitionProperty: 'background-color',
    transitionDuration: motion.hover,
    transitionTimingFunction: 'ease-out',
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
  hiddenRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingBlock: 7,
    paddingInline: 12,
  },
  hiddenLogo: {
    flexShrink: 0,
    color: tokens.labelTertiary,
  },
  hiddenNames: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    flexGrow: 1,
    minWidth: 0,
  },
  hiddenName: {
    fontSize: 13,
    lineHeight: '16px',
    color: tokens.labelSecondary,
  },
  hiddenVia: {
    fontSize: 11,
    lineHeight: '14px',
    color: tokens.labelTertiary,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2,
    padding: 8,
  },
  quit: {
    display: 'grid',
    placeItems: 'center',
    width: 28,
    height: 28,
    color: tokens.labelSecondary,
  },
});
