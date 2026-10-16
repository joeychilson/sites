import type { LogoName } from './components/logo';

// What the app shows on a Thursday at 7:00 AM, in its own words. Claude Max is in use and running
// out; two accounts were used this week; two more weren't.

/** How a limit stands: it lasts until it resets, runs out first, or is used up. */
export type Standing = 'lasts' | 'short' | 'out';

export type Limit = {
  name: string;
  /** When it runs out, in its standing's color. */
  runsOut?: string;
  /** When it resets, or when it's back if it's used up. */
  resets?: string;
  left: string;
  /** After what's left of money: "of $30". */
  of?: string;
  /** What's left, from 0 to 100. */
  percent: number;
  standing: Standing;
};

export type Account = {
  id: string;
  name: string;
  logo: LogoName;
  /** Under the name while closed: the deciding limit and what's next. */
  status: string;
  standing: Standing;
  /** On the right while closed: what's left of the deciding limit. */
  figure: string;
  /** In the menu bar while it's in use, when it differs from the figure. */
  menuBarFigure?: string;
  of?: string;
  limits: Array<Limit>;
  /** Under the limits when open: what they can't say. */
  note?: string;
  /** The sessions that used the deciding limit most. */
  usedMost?: { limit: string; sessions: Array<{ title: string; used: string }> };
};

export const verdict = { headline: 'Claude Max runs out in 1h', detail: 'Back in 3h.' };

export const inUse: Array<Account> = [
  {
    id: 'claude',
    name: 'Claude Max',
    logo: 'anthropic',
    status: '5 hours runs out in 1h',
    standing: 'short',
    figure: '28%',
    menuBarFigure: '1h',
    limits: [
      {
        name: '5 hours',
        runsOut: 'Runs out in 1h',
        resets: 'Resets in 3h',
        left: '28%',
        percent: 28,
        standing: 'short',
      },
      { name: 'Weekly', resets: 'Resets in 3h', left: '60%', percent: 60, standing: 'lasts' },
      { name: 'Opus weekly', resets: 'Back Sat 9 AM', left: '0%', percent: 0, standing: 'out' },
    ],
    usedMost: { limit: '5 hours', sessions: [{ title: 'Fix the parser', used: '32% · app' }] },
  },
];

export const usedThisWeek: Array<Account> = [
  {
    id: 'chatgpt',
    name: 'ChatGPT Pro',
    logo: 'openai',
    status: 'Monthly resets Oct 22',
    standing: 'lasts',
    figure: '97%',
    limits: [
      { name: 'Weekly', resets: 'Reset 6:30 AM', left: '100%', percent: 100, standing: 'lasts' },
      { name: 'Monthly', resets: 'Resets Oct 22', left: '97%', percent: 97, standing: 'lasts' },
    ],
    note: 'As read yesterday 9 PM; no agent here is signed in to it now.',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter API key',
    logo: 'openrouter',
    status: 'Pi’s key',
    standing: 'lasts',
    figure: '$8.70',
    of: 'of $30',
    limits: [
      { name: 'Pi’s key', left: '$8.70', of: 'of $30', percent: 29, standing: 'lasts' },
      { name: '5 hours', resets: 'Resets 11 AM', left: '100%', percent: 100, standing: 'lasts' },
      { name: 'Daily', resets: 'Resets in 3h', left: '99%', percent: 99, standing: 'lasts' },
    ],
    note: 'As read 6:50 AM; it couldn’t be read since.',
  },
];

export const notUsed: Array<Account> = [
  {
    id: 'opencode-go',
    name: 'OpenCode Go',
    logo: 'opencode',
    status: 'Sign in again',
    standing: 'lasts',
    figure: '—',
    limits: [],
    note: 'Open OpenCode to sign in again.',
  },
  {
    id: 'anthropic-api',
    name: 'Anthropic API key',
    logo: 'anthropic',
    status: 'Couldn’t be read yet',
    standing: 'lasts',
    figure: '—',
    limits: [],
    note: 'It couldn’t be read yet.',
  },
];
