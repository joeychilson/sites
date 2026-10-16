import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import appIcon from '../assets/app-icon-dark.webp';
import { inUse } from '../demo';
import { text } from '../styles/text';
import { media, tokens } from '../styles/tokens.stylex';
import { LimitLine } from './panel/account-row';
import LimitBar from './panel/limit-bar';

type Tile = {
  title: string;
  text: string;
  /** A piece of the app showing it. */
  shows: ReactNode;
};

const tiles: Array<Tile> = [
  {
    title: 'When it runs out',
    text: 'Whether each limit lasts until it resets, or when it runs out at your pace.',
    shows: <RunsOut />,
  },
  {
    title: 'Hours of work left',
    text: 'How much agent work a limit has left, with an 80% range.',
    shows: <WorkLeft />,
  },
  {
    title: 'What used it',
    text: 'Usage and cost by session, project, model or agent.',
    shows: <UsedMost />,
  },
  {
    title: 'Notifications',
    text: 'Before a limit runs out, when it’s used up, and when it’s back.',
    shows: <Notification />,
  },
];

/** What Turnscope forecasts, each over the piece of the app that shows it. */
export default function ForecastTiles() {
  return (
    <ul {...stylex.props(styles.grid)}>
      {tiles.map((tile) => (
        <li key={tile.title} {...stylex.props(styles.tile)}>
          <div aria-hidden="true" {...stylex.props(styles.stage)}>
            {tile.shows}
          </div>
          <h3 {...stylex.props(styles.title)}>{tile.title}</h3>
          <p {...stylex.props(text.body, styles.text)}>{tile.text}</p>
        </li>
      ))}
    </ul>
  );
}

// Claude Max's 5-hour limit, as its open row shows it.
function RunsOut() {
  const limit = inUse[0]?.limits[0];
  return (
    limit && (
      <span {...stylex.props(styles.runsOut)}>
        <LimitLine limit={limit} isShown />
      </span>
    )
  );
}

function WorkLeft() {
  return (
    <span {...stylex.props(styles.workLeft)}>
      <span {...stylex.props(styles.bigFigure)}>1h 10m</span>
      <span {...stylex.props(styles.secondary)}>of work left · 40m–2h 10m</span>
    </span>
  );
}

const sessions = [
  { title: 'Fix the parser', used: '32%', percent: 32 },
  { title: 'Write the release notes', used: '9%', percent: 9 },
];

function UsedMost() {
  return (
    <span {...stylex.props(styles.sessions)}>
      {sessions.map((session) => (
        <span key={session.title} {...stylex.props(styles.session)}>
          <span {...stylex.props(styles.sessionText)}>
            <span>{session.title}</span>
            <span {...stylex.props(styles.secondary)}>{session.used}</span>
          </span>
          <LimitBar percent={session.percent} standing="lasts" isShown />
        </span>
      ))}
    </span>
  );
}

function Notification() {
  return (
    <span {...stylex.props(styles.notification)}>
      <img src={appIcon} alt="" width={36} height={36} {...stylex.props(styles.icon)} />
      <span {...stylex.props(styles.note)}>
        <span {...stylex.props(styles.noteTitle)}>
          Claude Max <span {...stylex.props(styles.now)}>now</span>
        </span>
        <span>5 hours runs out 8 AM</span>
        <span {...stylex.props(styles.secondary)}>Back 10 AM.</span>
      </span>
    </span>
  );
}

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr', [media.wide]: 'repeat(2, 1fr)' },
    gap: 16,
  },
  tile: {
    padding: { default: 24, [media.wide]: 32 },
    borderRadius: 20,
    backgroundColor: colorVars['--color-background-muted'],
  },
  // As tall as the tallest piece, the notification, so the tiles' text lines up and the space above
  // it matches the sides.
  stage: {
    display: 'flex',
    alignItems: 'center',
    height: 76,
    marginBottom: 24,
    color: tokens.label,
    letterSpacing: 'normal',
  },
  title: {
    fontSize: 17,
    lineHeight: 1.4,
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  text: {
    marginTop: 6,
  },
  runsOut: {
    display: 'block',
    width: '100%',
    fontSize: 13,
    lineHeight: '16px',
  },
  workLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 13,
    lineHeight: '16px',
  },
  bigFigure: {
    fontSize: 40,
    lineHeight: 1.1,
    fontWeight: 600,
    letterSpacing: '-0.03em',
    fontVariantNumeric: 'tabular-nums',
  },
  secondary: {
    color: tokens.labelSecondary,
  },
  sessions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  session: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    width: '100%',
  },
  sessionText: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    fontSize: 13,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  },
  notification: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
    paddingBlock: 12,
    paddingInline: 14,
    borderRadius: 18,
    backgroundColor: tokens.glass,
    boxShadow: tokens.shadowNotification,
    fontSize: 13,
    lineHeight: '17px',
  },
  icon: {
    flexShrink: 0,
  },
  note: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  noteTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 600,
  },
  now: {
    fontWeight: 400,
    color: tokens.labelSecondary,
  },
});
