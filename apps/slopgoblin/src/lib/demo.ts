import { type CategoryId, categories } from '@/lib/content';

// The feed in the demo. Every post and person is made up, with no real handles.
// Each post carries the scores Gemini might return for it.

export interface DemoPost {
  id: string;
  name: string;
  /** What “Always show” remembers. */
  handle: string;
  /** Which of the theme's `face-*` colors its avatar uses. */
  face: 1 | 2 | 3 | 4 | 5;
  /** How long ago it was posted. Ads say “Ad” instead. */
  ago?: string;
  text: string;
  replyingTo?: string;
  /** Whether the reader follows this author on X. */
  followed?: boolean;
  isAd?: boolean;
  scores: Partial<Record<CategoryId, number>>;
}

export const posts: DemoPost[] = [
  {
    id: 'bread',
    name: 'Maya Ortiz',
    handle: 'mayaortiz',
    face: 1,
    ago: '12m',
    followed: true,
    text: 'Third try at sourdough. Finally got an ear on it.',
    scores: {},
  },
  {
    id: 'outrage',
    name: 'Daily Outrage',
    handle: 'dailyoutrage',
    face: 5,
    ago: '40m',
    text: 'Gen Z really thinks showing up to work is optional now. Unbelievable.',
    scores: { ragebait: 0.91 },
  },
  {
    id: 'dark-mode',
    name: 'Sam Reyes',
    handle: 'samreyes',
    face: 4,
    ago: '1h',
    followed: true,
    text: 'Dark mode is live. Two weeks of arguing about gray.',
    scores: {},
  },
  {
    id: 'signals',
    name: 'Signal Kings',
    handle: 'signalkings',
    face: 2,
    ago: '1h',
    replyingTo: 'Sam Reyes',
    text: 'Great post!! 🔥 Check my bio for the free signals that changed my life',
    scores: { reply_spam: 0.88, grift: 0.06 },
  },
  {
    id: 'tools',
    name: 'Tyler | AI Growth',
    handle: 'tyleraigrowth',
    face: 3,
    ago: '2h',
    text: 'AI won’t replace you. A person using AI will. Here are 10 tools that will make you unstoppable 🧵👇',
    scores: { ai_slop: 0.71, engagement_bait: 0.07 },
  },
  {
    id: 'bank',
    name: 'Northwind Bank',
    handle: 'northwindbank',
    face: 4,
    isAd: true,
    text: 'Banking that keeps up with you. Open an account in minutes.',
    scores: {},
  },
  {
    id: 'clip',
    name: 'Clip Vault',
    handle: 'clipvault',
    face: 1,
    ago: '3h',
    text: 'I didn’t know this 😱😱 wait for the end',
    scores: { clickbait: 0.72 },
  },
  {
    id: 'nadia',
    name: 'Nadia Chen',
    handle: 'nadiachen',
    face: 3,
    ago: '3h',
    followed: true,
    text: 'Every “10x engineer” I know spends half the afternoon naming a boolean.',
    scores: { ragebait: 0.62 },
  },
  {
    id: 'bus',
    name: 'Riverside Transit',
    handle: 'riversidetransit',
    face: 2,
    ago: '4h',
    text: 'The 14 is back on its usual route from Monday.',
    scores: {},
  },
  {
    id: 'presale',
    name: 'Moon Calls 🚀',
    handle: 'mooncalls',
    face: 5,
    ago: '4h',
    text: 'This gem is about to 100x. Presale closes tonight, DM me before it’s too late',
    scores: { grift: 0.96 },
  },
  {
    id: 'poll',
    name: 'Poll Farm',
    handle: 'pollfarm',
    face: 3,
    ago: '5h',
    text: 'Which one are you? Reply below and I’ll follow back 👇',
    scores: { engagement_bait: 0.67 },
  },
  {
    id: 'pizza',
    name: 'Liam Park',
    handle: 'liampark',
    face: 4,
    ago: '6h',
    text: 'Pineapple on pizza is fine and you all need a hobby',
    scores: { ragebait: 0.47 },
  },
];

/** What the reader let through from the bars. */
export interface Choices {
  /** Handles marked “Always show”. */
  trusted: string[];
  /** Posts let through with “Not …”. */
  notSlop: string[];
}

export interface Verdict {
  /** The likeliest kind of junk. */
  category: CategoryId;
}

/** Balanced, the extension's default strictness. */
const THRESHOLD = 0.6;

/**
 * Whether a post is hidden, as `judge` in the extension's `src/core/policy.ts` decides it with the
 * default settings: Balanced, every kind of junk on, and people you follow left alone.
 */
export function judge(post: DemoPost, choices: Choices): Verdict | null {
  if (choices.notSlop.includes(post.id) || choices.trusted.includes(post.handle)) {
    return null;
  }
  // X marks ads itself. Following an account doesn't make its ads welcome.
  if (post.isAd) {
    return { category: 'ad' };
  }
  if (post.followed) {
    return null;
  }
  let score = 0;
  let top: { id: CategoryId; p: number } | undefined;
  for (const { id } of categories) {
    const p = post.scores[id] ?? 0;
    score += p;
    if (p > 0 && (!top || p > top.p)) {
      top = { id, p };
    }
  }
  return top && score >= THRESHOLD ? { category: top.id } : null;
}
