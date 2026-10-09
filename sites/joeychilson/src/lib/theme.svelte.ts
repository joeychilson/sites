import { MediaQuery } from 'svelte/reactivity';
import { browser } from '$app/env';

type Mode = 'light' | 'dark';

/** Must match the key the inline script in `app.html` reads. */
const KEY = 'theme';

/**
 * Day or night: a choice made by clicking the city, kept in `localStorage`,
 * or else the system's appearance. The inline script in `app.html` applies a
 * saved choice before the first paint.
 */
export class Theme {
  #system = new MediaQuery('(prefers-color-scheme: dark)', false);
  #still = new MediaQuery('(prefers-reduced-motion: reduce)', false);
  // Read from the page, where the inline script in `app.html` has applied it.
  #choice = $state(
    browser ? ((document.documentElement.dataset.theme as Mode | undefined) ?? null) : null,
  );

  readonly dark = $derived(this.#choice ? this.#choice === 'dark' : this.#system.current);

  /**
   * Night falls from the top of the page, and day comes up from the bottom:
   * the browser pictures the page before and after, and `app.css` wipes one
   * into the other. Without view transitions, or with reduced motion, it
   * switches at once.
   */
  toggle() {
    const next: Mode = this.dark ? 'light' : 'dark';
    const root = document.documentElement;
    const apply = () => {
      this.#choice = next;
      root.dataset.theme = next;
    };

    if (!document.startViewTransition || this.#still.current) apply();
    else {
      root.dataset.switching = next === 'dark' ? 'night' : 'day';
      void document
        .startViewTransition(apply)
        .finished.finally(() => delete root.dataset.switching);
    }

    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Storage can be off, as in private windows; the choice lasts the visit.
    }
  }
}
