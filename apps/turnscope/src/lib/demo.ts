import type { LogoName } from '@/components/logo';

// As the app names them: a limit lasts until it resets, runs out before then, or is used up.
export type Standing = 'lasts' | 'runningOut' | 'usedUp';

export interface Limit {
  name: string;
  runsOut?: string;
  resets?: string;
  left: string;
  of?: string;
  percent: number;
  standing: Standing;
}

export interface Account {
  id: string;
  name: string;
  logo: LogoName;
  status: string;
  standing: Standing;
  figure: string;
  menuBarFigure?: string;
  of?: string;
  limits: Limit[];
  note?: string;
  usedMost?: { limit: string; sessions: { title: string; used: string }[] };
}

export const verdict = { headline: 'Claude Max runs out in 1h', detail: 'Back in 3h.' };

export const inUse: Account[] = [
  {
    id: 'claude',
    name: 'Claude Max',
    logo: 'anthropic',
    status: '5 hours runs out in 1h',
    standing: 'runningOut',
    figure: '28%',
    menuBarFigure: '1h',
    limits: [
      {
        name: '5 hours',
        runsOut: 'Runs out in 1h',
        resets: 'Resets in 3h',
        left: '28%',
        percent: 28,
        standing: 'runningOut',
      },
      { name: 'Weekly', resets: 'Resets in 3h', left: '60%', percent: 60, standing: 'lasts' },
      { name: 'Opus weekly', resets: 'Back Sat 9 AM', left: '0%', percent: 0, standing: 'usedUp' },
    ],
    usedMost: { limit: '5 hours', sessions: [{ title: 'Fix the parser', used: '32% · app' }] },
  },
];

export const usedThisWeek: Account[] = [
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
    note: 'Last read yesterday 9 PM. No agent here is signed in to it.',
  },
  {
    id: 'google-ai',
    name: 'Google AI Pro',
    logo: 'google',
    status: 'Weekly resets Tue 9 PM',
    standing: 'lasts',
    figure: '84%',
    limits: [
      { name: '5 hours', resets: 'Resets 11:30 AM', left: '91%', percent: 91, standing: 'lasts' },
      { name: 'Weekly', resets: 'Resets Tue 9 PM', left: '84%', percent: 84, standing: 'lasts' },
      { name: 'Claude and GPT 5 hours', left: '100%', percent: 100, standing: 'lasts' },
      {
        name: 'Claude and GPT weekly',
        resets: 'Resets Tue 9 PM',
        left: '62%',
        percent: 62,
        standing: 'lasts',
      },
    ],
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
    note: 'It couldn’t be read since 6:50 AM.',
  },
];

export const notUsed: Account[] = [
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
