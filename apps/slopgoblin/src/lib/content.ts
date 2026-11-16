// Keep `categories` in step with `src/core/taxonomy.ts` in the Slop Goblin repo.

export type CategoryId =
  | 'ragebait'
  | 'ai_slop'
  | 'clickbait'
  | 'engagement_bait'
  | 'reply_spam'
  | 'nsfw'
  | 'grift'
  | 'ad';

export const categories: { id: CategoryId; label: string }[] = [
  { id: 'ragebait', label: 'Ragebait' },
  { id: 'ai_slop', label: 'AI slop' },
  { id: 'clickbait', label: 'Clickbait' },
  { id: 'engagement_bait', label: 'Engagement bait' },
  { id: 'reply_spam', label: 'Reply spam' },
  { id: 'nsfw', label: 'NSFW' },
  { id: 'grift', label: 'Grift' },
  { id: 'ad', label: 'Ad' },
];

export const labelOf = (id: CategoryId) => categories.find((c) => c.id === id)?.label ?? '';

/** A label as it reads mid-sentence: “ragebait”, but “AI slop” and “NSFW” keep their capitals. */
export const inSentence = (label: string) =>
  label.replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase());
