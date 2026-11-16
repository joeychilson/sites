import { useCallback, useEffect, useRef, useState } from 'react';

import type { BarAction, PostView } from '@/components/demo/feed';
import { type Choices, type DemoPost, judge, posts } from '@/lib/demo';

/** Nothing let through, for what the goblin made of each post before the reader stepped in. */
const NONE: Choices = { trusted: [], notSlop: [] };

/** How long the goblin takes over each post. */
const READ_MS = 260;
/** How long it waits before the first, so it has climbed up by then. */
const START_MS = 900;

/** The extension at work on the demo feed: what it has read so far, and what the reader did. */
export function useDemo() {
  // Posts the goblin has been through so far.
  const [read, setRead] = useState(0);
  const [choices, setChoices] = useState<Choices>({ trusted: [], notSlop: [] });
  const [revealed, setRevealed] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<Record<string, 'not-slop' | 'trust'>>({});
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const started = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  /** Sends the goblin through the feed, once. */
  const start = useCallback(() => {
    if (started.current) {
      return;
    }
    started.current = true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRead(posts.length);
      return;
    }
    let n = 0;
    const next = () => {
      setRead(++n);
      if (n < posts.length) {
        timer.current = setTimeout(next, READ_MS);
      }
    };
    timer.current = setTimeout(next, START_MS);
  }, []);

  const seen = posts.slice(0, read);
  const verdicts = new Map(seen.map((post) => [post.id, judge(post, choices)]));
  const caught = new Map(seen.map((post) => [post.id, judge(post, NONE)]));
  const hidden = [...verdicts.values()].filter(Boolean).length;

  const viewOf = (id: string): PostView => {
    const verdict = caught.get(id);
    if (!verdict) {
      return { mode: 'shown' };
    }
    const action = confirmed[id];
    if (action) {
      return { mode: 'confirmed', verdict, action };
    }
    // Let through some other way, such as “Always show” on another of its author's posts.
    if (!verdicts.get(id)) {
      return { mode: 'shown' };
    }
    return revealed.includes(id) ? { mode: 'revealed', verdict } : { mode: 'collapsed', verdict };
  };

  const act = ({ id, handle }: DemoPost, action: BarAction) => {
    const without = (list: string[], item: string) => list.filter((x) => x !== item);
    switch (action) {
      case 'reveal':
        setRevealed((list) => [...without(list, id), id]);
        return;
      case 'hide':
        setRevealed((list) => without(list, id));
        return;
      case 'not-slop':
        setChoices((c) => ({ ...c, notSlop: [...c.notSlop, id] }));
        setConfirmed((c) => ({ ...c, [id]: 'not-slop' }));
        return;
      case 'trust':
        setChoices((c) => ({ ...c, trusted: [...c.trusted, handle] }));
        setConfirmed((c) => ({ ...c, [id]: 'trust' }));
        return;
      case 'undo':
        setChoices((c) => ({
          notSlop: without(c.notSlop, id),
          trusted: confirmed[id] === 'trust' ? without(c.trusted, handle) : c.trusted,
        }));
        setConfirmed((c) => Object.fromEntries(Object.entries(c).filter(([key]) => key !== id)));
        setRevealed((list) => without(list, id));
    }
  };

  return { hidden, viewOf, act, start };
}
