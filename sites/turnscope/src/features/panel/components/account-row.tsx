import { colorVars, focusVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import type { Ref } from 'react';

import Logo from '../../../components/logo';
import { a11y } from '../../../styles/a11y';
import { standingInk } from '../../../styles/standing';
import { motion, tokens } from '../../../styles/tokens.stylex';
import type { Account, Limit, Session } from '../accounts';
import { appears } from '../styles/appears';
import Collapse from './collapse';
import LimitBar from './limit-bar';

type AccountRowProps = {
  account: Account;
  isOpen: boolean;
  onToggle: () => void;
  ref?: Ref<HTMLButtonElement>;
};

type LimitLineProps = {
  limit: Limit;
  isShown: boolean;
  /** Ends its row, so it keeps the space a line of text keeps above its letters. */
  isLast: boolean;
};

type UsedMostProps = {
  limit: string;
  sessions: Array<Session>;
};

/**
 * One account, the same everywhere it's listed. Closed, it shows the limit that decides it and
 * what's left of that. Open, a line and bar per limit, then a note on what they can't say, and the
 * sessions that used it most. The whole row opens and closes it; screen readers get the summary as
 * the button, then each line on its own.
 */
export default function AccountRow({ account, isOpen, onToggle, ref }: AccountRowProps) {
  const detailsId = `${account.id}-details`;
  const isShowingLimits = isOpen && account.limits.length > 0;

  return (
    <span {...stylex.props(styles.row, isOpen && styles.open)}>
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        aria-controls={detailsId}
        onClick={onToggle}
        {...stylex.props(styles.summary)}
      >
        <Logo name={account.logo} width={18} height={18} {...stylex.props(styles.logo)} />
        <span {...stylex.props(styles.names)}>
          <span {...stylex.props(styles.name)}>{account.name}</span>
          {/* The limit lines say everything the line under the name does, so it gives way to them. */}
          <Collapse isOpen={!isShowingLimits}>
            <span {...stylex.props(styles.status, standingInk[account.standing])}>
              {account.status}
            </span>
          </Collapse>
        </span>
        <span {...stylex.props(styles.figure, isShowingLimits ? appears.hidden : appears.shown)}>
          <span {...stylex.props(styles.strong, standingInk[account.standing])}>
            {account.figure}
          </span>
          {account.of && <span {...stylex.props(styles.dimmed)}> {account.of}</span>}
        </span>
      </button>
      <span id={detailsId} {...stylex.props(styles.block)}>
        <Collapse isOpen={isOpen}>
          <span {...stylex.props(styles.details)}>
            {account.limits.map((limit, index) => (
              <LimitLine
                key={limit.name}
                limit={limit}
                isShown={isOpen}
                isLast={index === account.limits.length - 1 && !account.note && !account.usedMost}
              />
            ))}
            {account.note && <span {...stylex.props(styles.note)}>{account.note}</span>}
            {account.usedMost && (
              <UsedMost limit={account.usedMost.limit} sessions={account.usedMost.sessions} />
            )}
          </span>
        </Collapse>
      </span>
    </span>
  );
}

/** A limit's name and times, what's left, and its bar. */
function LimitLine({ limit, isShown, isLast }: LimitLineProps) {
  return (
    <span {...stylex.props(styles.limit, isLast && styles.underBar)}>
      <span {...stylex.props(styles.limitText)}>
        <span {...stylex.props(styles.limitTimes)}>
          <span {...stylex.props(styles.medium)}>{limit.name}</span>
          {limit.runsOut && (
            <>
              {' · '}
              <span {...stylex.props(standingInk[limit.standing])}>{limit.runsOut}</span>
            </>
          )}
          {limit.resets && (
            <>
              {' · '}
              <span {...stylex.props(limit.standing === 'out' && standingInk.out)}>
                {limit.resets}
              </span>
            </>
          )}
        </span>
        <span {...stylex.props(styles.limitLeft)}>
          <span {...stylex.props(styles.medium, standingInk[limit.standing])}>{limit.left}</span>
          {limit.of && <span {...stylex.props(styles.dimmed)}> {limit.of}</span>}
        </span>
      </span>
      <LimitBar percent={limit.percent} standing={limit.standing} isShown={isShown} />
    </span>
  );
}

/** The sessions that used the deciding limit most, the one at work now marked green. */
function UsedMost({ limit, sessions }: UsedMostProps) {
  return (
    <span {...stylex.props(styles.usedMost)}>
      <span {...stylex.props(styles.heading)}>Used most of {limit}</span>
      {sessions.map((session) => (
        <span key={session.title} {...stylex.props(styles.session)}>
          <span {...stylex.props(styles.sessionTitle)}>
            {session.title}
            {session.isActive && (
              <>
                <span aria-hidden="true" {...stylex.props(styles.activeDot)} />
                <span {...stylex.props(a11y.visuallyHidden)}>Active now</span>
              </>
            )}
          </span>
          <span {...stylex.props(styles.sessionUsed)}>{session.used}</span>
        </span>
      ))}
    </span>
  );
}

// The app's row (macos/Turnscope/Style.swift): 7 by 12 points of padding, an 18-point logo 8 from
// the name, a 10-point corner, and a soft fill while hovered or open.
const styles = stylex.create({
  row: {
    position: 'relative',
    display: 'block',
    paddingBlock: 7,
    paddingInline: 12,
    borderRadius: 10,
    backgroundColor: { default: 'transparent', ':hover': tokens.rowHover },
    transitionProperty: 'background-color',
    transitionDuration: motion.hover,
    transitionTimingFunction: 'ease-out',
    // The button inside takes focus; the ring goes around the whole row.
    outlineStyle: { default: 'none', ':has(:focus-visible)': 'solid' },
    outlineWidth: 2,
    outlineColor: focusVars['--focus-outline-color'],
    outlineOffset: -2,
  },
  open: {
    backgroundColor: tokens.rowHover,
  },
  // Its ::after covers the row, so a click anywhere on it, details included, opens or closes it.
  summary: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    textAlign: 'start',
    cursor: 'default',
    outlineStyle: 'none',
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 10,
    },
  },
  logo: {
    flexShrink: 0,
  },
  names: {
    flexGrow: 1,
    minWidth: 0,
  },
  name: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 13,
    lineHeight: '16px',
  },
  status: {
    display: 'block',
    paddingTop: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 11,
    lineHeight: '14px',
    color: tokens.labelSecondary,
  },
  figure: {
    flexShrink: 0,
    paddingInlineStart: 8,
    fontSize: 13,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  },
  strong: {
    fontWeight: 600,
  },
  medium: {
    fontWeight: 500,
  },
  dimmed: {
    color: tokens.labelSecondary,
  },
  block: {
    display: 'block',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingTop: 10,
  },
  limit: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  underBar: {
    paddingBottom: 3,
  },
  limitText: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    fontSize: 11,
    lineHeight: '14px',
  },
  limitTimes: {
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: tokens.labelSecondary,
  },
  limitLeft: {
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
  },
  note: {
    fontSize: 12,
    lineHeight: '15px',
    color: tokens.labelSecondary,
  },
  usedMost: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  heading: {
    fontSize: 11,
    lineHeight: '14px',
    fontWeight: 600,
    color: tokens.labelSecondary,
  },
  session: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  sessionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 12,
    lineHeight: '15px',
  },
  sessionUsed: {
    fontSize: 11,
    lineHeight: '14px',
    fontVariantNumeric: 'tabular-nums',
    color: tokens.labelSecondary,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: colorVars['--color-success'],
  },
});
