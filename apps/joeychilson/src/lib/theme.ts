type Theme = 'light' | 'dark';

const storageKey = 'theme';

// Runs before first paint, so a remembered choice never flashes the other theme.
export const restoreTheme = `try{const t=localStorage.getItem('${storageKey}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}`;

function remember(theme: Theme | undefined) {
  try {
    if (theme) {
      localStorage.setItem(storageKey, theme);
    } else {
      localStorage.removeItem(storageKey);
    }
  } catch {
    // Private windows can refuse storage; the switch still holds for this visit.
  }
}

export function toggleTheme() {
  const root = document.documentElement;
  const systemIsDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = root.dataset.theme ? root.dataset.theme === 'dark' : systemIsDark;
  const next: Theme = isDark ? 'light' : 'dark';

  const apply = () => {
    // A choice that matches the system is forgotten, so the site follows the system again.
    const choice = (next === 'dark') === systemIsDark ? undefined : next;
    if (choice) {
      root.dataset.theme = choice;
    } else {
      delete root.dataset.theme;
    }
    remember(choice);
  };

  if (!document.startViewTransition) {
    apply();
    return;
  }
  document.startViewTransition({
    update: apply,
    types: [next === 'dark' ? 'nightfall' : 'daybreak'],
  });
}
