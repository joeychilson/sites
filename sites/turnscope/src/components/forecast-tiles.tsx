import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import appIcon from '../assets/app-icon-dark.webp';
import LimitBar from '../features/panel/components/limit-bar';
import { media, tokens } from '../styles/tokens.stylex';

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

const sessions = [
  { title: 'Fix the parser', used: '32%', percent: 32 },
  { title: 'Write the release notes', used: '9%', percent: 9 },
];

/** What Turnscope tells you, each with the part of the app that says it. */
export default function ForecastTiles() {
  return (
    <ul {...stylex.props(styles.grid)}>
      {tiles.map((tile) => (
        <li key={tile.title} {...stylex.props(styles.tile)}>
          <div aria-hidden="true" {...stylex.props(styles.stage)}>
            {tile.shows}
          </div>
          <h3 {...stylex.props(styles.title)}>{tile.title}</h3>
          <p {...stylex.props(styles.text)}>{tile.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** A limit's line in the panel, running out. */
function RunsOut() {
  return (
    <span {...stylex.props(styles.limit)}>
      <span {...stylex.props(styles.limitText)}>
        <span {...stylex.props(styles.secondary)}>
          <span {...stylex.props(styles.medium)}>5 hours</span> ·{' '}
          <span {...stylex.props(styles.warning)}>Runs out in 1h</span> · Resets in 3h
        </span>
        <span {...stylex.props(styles.medium, styles.warning)}>28%</span>
      </span>
      <LimitBar percent={28} standing="short" isShown />
    </span>
  );
}

/** The hours of work a limit has left, as agents are told. */
function WorkLeft() {
  return (
    <span {...stylex.props(styles.workLeft)}>
      <span {...stylex.props(styles.bigFigure)}>1h 10m</span>
      <span {...stylex.props(styles.secondary)}>of work left · 40m–2h 10m</span>
    </span>
  );
}

/** The sessions that used a limit most. */
function UsedMost() {
  return (
    <span {...stylex.props(styles.sessions)}>
      {sessions.map((session) => (
        <span key={session.title} {...stylex.props(styles.limit)}>
          <span {...stylex.props(styles.limitText)}>
            <span>{session.title}</span>
            <span {...stylex.props(styles.secondary)}>{session.used}</span>
          </span>
          <LimitBar percent={session.percent} standing="lasts" isShown />
        </span>
      ))}
    </span>
  );
}

/** A notification the app posts, as macOS shows it. */
function Notification() {
  return (
    <span {...stylex.props(styles.notification)}>
      <img src={appIcon} alt="" width={36} height={36} {...stylex.props(styles.icon)} />
      <span {...stylex.props(styles.note)}>
        <span {...stylex.props(styles.noteTitle)}>
          Claude Max <span {...stylex.props(styles.now)}>now</span>
        </span>
        <span>5 hours runs out 10:00 AM</span>
        <span {...stylex.props(styles.secondary)}>Back 1:00 PM.</span>
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
  // As tall as the tallest piece, the notification, so the tiles' text lines up and the padding
  // above it is the same as at the sides.
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
    fontSize: 15,
    lineHeight: 1.6,
    color: colorVars['--color-text-secondary'],
    textWrap: 'pretty',
  },
  limit: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    width: '100%',
  },
  limitText: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    fontSize: 13,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  },
  secondary: {
    color: tokens.labelSecondary,
  },
  medium: {
    fontWeight: 500,
  },
  warning: {
    color: colorVars['--color-warning'],
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
  sessions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  // A macOS notification banner.
  notification: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
    paddingBlock: 12,
    paddingInline: 14,
    borderRadius: 18,
    backgroundColor: tokens.glass,
    boxShadow: 'inset 0 0 0 0.5px rgb(255 255 255 / 0.12), 0 8px 24px rgb(0 0 0 / 0.35)',
    fontSize: 13,
    lineHeight: '17px',
  },
  icon: {
    flexShrink: 0,
    width: 36,
    height: 36,
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
