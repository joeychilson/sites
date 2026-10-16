// Day and night are Astryx's light and dark. The site follows the system until a visitor picks the
// other one, which it remembers until they pick the system's again.

const KEY = 'theme';

/** Runs before first paint, so a remembered choice never flashes the other theme. */
export const restoreNight = `try{const t=localStorage.getItem('${KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}`;

const systemIsDark = () => matchMedia('(prefers-color-scheme: dark)').matches;

function isNight() {
  const { theme } = document.documentElement.dataset;
  return theme ? theme === 'dark' : systemIsDark();
}

function setNight(night: boolean) {
  const theme = night === systemIsDark() ? null : night ? 'dark' : 'light';
  const root = document.documentElement;
  if (theme) root.dataset.theme = theme;
  else delete root.dataset.theme;
  try {
    if (theme) localStorage.setItem(KEY, theme);
    else localStorage.removeItem(KEY);
  } catch {
    // Some private windows have no storage; the switch still holds for this page.
  }
}

export function toggleNight() {
  const night = !isNight();
  // Browsers without transition types (before Chrome 125 and Safari 18.2) throw on the options.
  if (
    typeof ViewTransition === 'undefined' ||
    !('types' in ViewTransition.prototype) ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    setNight(night);
    return;
  }
  document.startViewTransition({
    update: () => setNight(night),
    types: ['theme', night ? 'night' : 'day'],
  });
}
