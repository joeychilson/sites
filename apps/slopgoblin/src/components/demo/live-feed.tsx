import { useRef } from 'react';

import { FeedPost } from '@/components/demo/feed';
import { Goblin } from '@/components/goblin';
import { useDemo } from '@/hooks/use-demo';
import { useInView } from '@/hooks/use-in-view';
import { posts } from '@/lib/demo';

/**
 * A feed with the goblin peeking over it, folding the junk away one post after another once it's
 * in view. The bars open as they do in the extension. The feed keeps one height, fading out
 * whatever's below, so nothing under it moves as posts fold and open.
 */
export function LiveFeed() {
  const demo = useDemo();
  const feed = useRef<HTMLOListElement>(null);
  useInView(feed, demo.start);

  return (
    // Room above the feed for the goblin's head.
    <div className="relative isolate pt-[84px] sm:pt-[106px]">
      <div className="relative">
        <Goblin fed={demo.hidden} className="right-[18px] [zoom:1.6] sm:right-[36px] sm:[zoom:2]" />
        <ol
          ref={feed}
          aria-label="A feed, with Slop Goblin on it"
          // `clip`, not `hidden`, so tabbing to a bar past the fade can't scroll the feed. Posts move
          // inside as others fold, and the page mustn't scroll to follow them.
          className="relative z-1 h-[470px] overflow-clip rounded-[28px] bg-feed [--color-focus:var(--color-accent)] [overflow-anchor:none] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-20 after:bg-linear-to-t after:from-feed after:to-transparent lg:h-[clamp(400px,calc(100svh-282px),560px)]"
        >
          {posts.map((post) => (
            <FeedPost
              key={post.id}
              post={post}
              view={demo.viewOf(post.id)}
              onAction={(action) => demo.act(post, action)}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
