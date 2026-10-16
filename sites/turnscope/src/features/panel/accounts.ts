import type { LogoName } from '../../components/logo';
import type { Standing } from '../../styles/standing';

// The panel at Thu 7:00 AM, in the app's own words. Claude Max is in use and running out; two
// accounts were used this week; three more weren't, and one of those is hidden.

export type Limit = {
  name: string;
  /** When it runs out, in its standing's color. */
  runsOut?: string;
  /** When it resets, or when it's back if it's used up. */
  resets?: string;
  left: string;
  /** After what's left of money: "of $30". */
  of?: string;
  percent: number;
  standing: Standing;
};

export type Session = {
  title: string;
  /** Its share of the limit, and the folder it ran in. */
  used: string;
  isActive: boolean;
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
  /** What the menu bar shows while it's in use. */
  menuBarFigure?: string;
  of?: string;
  limits: Array<Limit>;
  /** Under the limits when open: what they can't say. */
  note?: string;
  /** The sessions that used the deciding limit most. */
  usedMost?: { limit: string; sessions: Array<Session> };
  /** The agents that use it, as Settings lists it. */
  via?: string;
  isApiKey: boolean;
};

type Agent = {
  name: string;
  logo: LogoName;
  isConnected: boolean;
};

export const verdict = { headline: 'Claude Max runs out in 1h', detail: 'Back in 3h.' };

/** The headline once every account in use is hidden. */
export const hiddenVerdict = {
  headline: 'Nothing in use',
  detail: 'Only accounts you hid are in use.',
};

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
    usedMost: {
      limit: '5 hours',
      sessions: [{ title: 'Fix the parser', used: '32% · app', isActive: true }],
    },
    via: 'via Claude Code',
    isApiKey: false,
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
    via: 'via Codex',
    isApiKey: false,
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
    via: 'via Pi',
    isApiKey: true,
  },
];

export const notUsed: Array<Account> = [
  {
    id: 'opencode-go',
    name: 'OpenCode Go',
    logo: 'opencode-go',
    status: 'Sign in again',
    standing: 'lasts',
    figure: '—',
    limits: [],
    note: 'Open OpenCode to sign in again.',
    via: 'via OpenCode',
    isApiKey: false,
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
    isApiKey: true,
  },
  {
    id: 'supergrok',
    name: 'SuperGrok',
    logo: 'xai',
    status: 'Weekly resets Mon',
    standing: 'lasts',
    figure: '100%',
    limits: [
      { name: 'Weekly', resets: 'Resets Mon 9 AM', left: '100%', percent: 100, standing: 'lasts' },
    ],
    via: 'via Grok Build',
    isApiKey: false,
  },
];

/** Every account, as Settings lists them and the hidden ones gather. */
export const accounts = [...inUse, ...usedThisWeek, ...notUsed];

/** Hidden from the menu bar and the panel until shown again. */
export const initiallyHidden = ['supergrok'];

export const agents: Array<Agent> = [
  { name: 'Claude Code', logo: 'anthropic', isConnected: true },
  { name: 'Codex', logo: 'openai', isConnected: true },
  { name: 'OpenCode', logo: 'opencode', isConnected: false },
  { name: 'Pi', logo: 'pi', isConnected: false },
  { name: 'Grok Build', logo: 'xai', isConnected: false },
];
