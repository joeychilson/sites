import { colorVars, focusVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import type { Account, Limit } from '../../demo';
import { a11y } from '../../styles/a11y';
import { tokens } from '../../styles/tokens.stylex';
import Logo from '../logo';
import Collapse from './collapse';
import LimitBar from './limit-bar';
import { appears, row, standingInk } from './styles';

type AccountRowProps = {
  account: Account;
  isOpen: boolean;
  onToggle: () => void;
};

type LimitLineProps = {
  limit: Limit;
  /** Grows the bar into place as the line is shown. */
  isShown: boolean;
};

export default function AccountRow({ account, isOpen, onToggle }: AccountRowProps) {
  const detailsId = `${account.id}-details`;
  const showsLimits = isOpen && account.limits.length > 0;

  // Only the summary is the button, so screen readers read the details line by line after it.
  return (
    <span {...stylex.props(row.padding, row.hover, styles.row, isOpen && styles.open)}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={detailsId}
        onClick={onToggle}
        {...stylex.props(styles.summary)}
      >
        <Logo name={account.logo} width={18} height={18} {...stylex.props(styles.logo)} />
        <span {...stylex.props(styles.names)}>
          <span {...stylex.props(styles.name)}>{account.name}</span>
          {/* The limit lines say all the status does, so it gives way to them. */}
          <Collapse isOpen={!showsLimits}>
            <span {...stylex.props(styles.status, standingInk[account.standing])}>
              {account.status}
            </span>
          </Collapse>
        </span>
        <span {...stylex.props(styles.figure, showsLimits ? appears.hidden : appears.shown)}>
          <span {...stylex.props(styles.strong, standingInk[account.standing])}>
            {account.figure}
          </span>
          {account.of && <span {...stylex.props(styles.dimmed)}> {account.of}</span>}
        </span>
      </button>
      <Collapse isOpen={isOpen}>
        <span id={detailsId} {...stylex.props(styles.details)}>
          {account.limits.map((limit) => (
            <LimitLine key={limit.name} limit={limit} isShown={isOpen} />
          ))}
          {account.note && <span {...stylex.props(styles.note)}>{account.note}</span>}
          {account.usedMost && (
            <span {...stylex.props(styles.usedMost)}>
              <span {...stylex.props(styles.heading)}>Used most of {account.usedMost.limit}</span>
              {account.usedMost.sessions.map((session) => (
                <span key={session.title} {...stylex.props(styles.session)}>
                  <span {...stylex.props(styles.sessionTitle)}>
                    {session.title}
                    <span aria-hidden="true" {...stylex.props(styles.activeDot)} />
                    <span {...stylex.props(a11y.visuallyHidden)}>Active now</span>
                  </span>
                  <span {...stylex.props(styles.sessionUsed)}>{session.used}</span>
                </span>
              ))}
            </span>
          )}
        </span>
      </Collapse>
    </span>
  );
}

/** A limit's name, its times and what's left, over its bar. */
export function LimitLine({ limit, isShown }: LimitLineProps) {
  return (
    <span {...stylex.props(styles.limit)}>
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

const styles = stylex.create({
  row: {
    position: 'relative',
    display: 'block',
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
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingTop: 10,
    fontSize: 11,
    lineHeight: '14px',
  },
  limit: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  limitText: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
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
