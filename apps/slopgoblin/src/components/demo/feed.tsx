import type { ReactNode } from 'react';

import { Fold } from '@/components/fold';
import { GoblinGlyph } from '@/components/glyph';
import { inSentence, labelOf } from '@/lib/content';
import type { DemoPost, Verdict } from '@/lib/demo';

/**
 * What a post looks like in the feed, matching `View` in the extension's `src/content/bar.ts`. A post
 * the goblin hid keeps its verdict in every state, so the bar and the line above the post have
 * their words while they fold away.
 */
export type PostView =
  | { mode: 'shown' }
  | { mode: 'collapsed' | 'revealed'; verdict: Verdict }
  | { mode: 'confirmed'; verdict: Verdict; action: 'not-slop' | 'trust' };

export type BarAction = 'reveal' | 'hide' | 'not-slop' | 'trust' | 'undo';

/** The avatars' colors, by `DemoPost.face`. */
const faces = {
  1: 'bg-face-1',
  2: 'bg-face-2',
  3: 'bg-face-3',
  4: 'bg-face-4',
  5: 'bg-face-5',
};

export function FeedPost({
  post,
  view,
  onAction,
}: {
  post: DemoPost;
  view: PostView;
  onAction: (action: BarAction) => void;
}) {
  const hidden = view.mode !== 'shown';
  return (
    <li className="border-b border-line last:border-b-0">
      <Fold open={view.mode === 'collapsed'}>
        {hidden && (
          <button
            type="button"
            onClick={() => onAction('reveal')}
            // Inside the ring, as the feed clips anything past its edges.
            className="group flex min-h-10 w-full cursor-pointer items-center gap-2 px-4 text-start text-[14px]/5 text-muted transition-colors hover:bg-hover focus-visible:-outline-offset-2"
          >
            <span className="flex w-9 flex-none justify-center">
              <span className={`size-5 rounded-full opacity-45 grayscale ${faces[post.face]}`} />
            </span>
            <span className="min-w-0 grow truncate">
              <strong className="font-semibold text-ink">{labelOf(view.verdict.category)}</strong>{' '}
              from {post.name}
            </span>
            <span className="flex-none font-medium text-accent group-hover:underline">Show</span>
          </button>
        )}
      </Fold>

      <Fold open={view.mode !== 'collapsed'}>
        <Fold open={view.mode === 'revealed' || view.mode === 'confirmed'}>
          {hidden && <Context post={post} view={view} onAction={onAction} />}
        </Fold>
        <Body post={post} />
      </Fold>
    </li>
  );
}

/**
 * The line above a post let back in: a small goblin lined up with the avatar, then the words. A
 * collapsed post keeps the revealed line, for the moment it takes to fold away after Hide.
 */
function Context({
  post,
  view,
  onAction,
}: {
  post: DemoPost;
  view: Exclude<PostView, { mode: 'shown' }>;
  onAction: (action: BarAction) => void;
}) {
  let words: ReactNode;
  let actions: ReactNode;

  if (view.mode === 'confirmed') {
    words =
      view.action === 'trust'
        ? `Posts from ${post.name} will always show`
        : 'This post won’t be hidden again';
    actions = <Action label="Undo" primary onClick={() => onAction('undo')} />;
  } else {
    const label = labelOf(view.verdict.category);
    words = label;
    actions = (
      <>
        {view.verdict.category !== 'ad' && (
          <>
            <Action label={`Not ${inSentence(label)}`} onClick={() => onAction('not-slop')} />
            <Action label={`Always show ${post.name}`} onClick={() => onAction('trust')} />
          </>
        )}
        <Action label="Hide" primary onClick={() => onAction('hide')} />
      </>
    );
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 pt-3 text-[13px]/4 text-muted">
      <span className="me-auto font-bold">
        <GoblinGlyph className="me-1.5 inline h-3 w-4 align-[-1px]" />
        {words}
      </span>
      {actions}
    </div>
  );
}

function Action({
  label,
  primary = false,
  onClick,
}: {
  label: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer whitespace-nowrap hover:text-ink hover:underline ${primary ? 'font-medium text-accent' : ''}`}
    >
      {label}
    </button>
  );
}

function Body({ post }: { post: DemoPost }) {
  return (
    <article className="flex gap-3 px-4 py-3">
      <span
        aria-hidden="true"
        className={`grid size-9 flex-none place-items-center rounded-full font-display text-[15px] font-bold text-face-ink ${faces[post.face]}`}
      >
        {post.name[0]}
      </span>
      <div className="min-w-0 grow text-[14px]/[19px]">
        <div className="flex items-center gap-1.5 truncate">
          <span className="truncate font-bold text-ink">{post.name}</span>
          <span className="flex-none text-[13px] text-muted">
            {post.isAd ? '· Ad' : `· ${post.ago}`}
          </span>
          {post.followed && (
            <span className="ms-1 flex-none rounded-full bg-well px-2 py-0.5 text-[11px] font-medium text-muted">
              Following
            </span>
          )}
        </div>
        {post.replyingTo && <p className="text-[13px] text-muted">Replying to {post.replyingTo}</p>}
        <p className="mt-0.5 text-pretty text-ink">{post.text}</p>
      </div>
    </article>
  );
}
