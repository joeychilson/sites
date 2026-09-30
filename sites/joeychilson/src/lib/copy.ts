/**
 * Gives each code block in `prose` a button that copies its code: an
 * attachment for the element the post's HTML is set in.
 */
export function copyButtons(prose: HTMLElement) {
  const timers: ReturnType<typeof setTimeout>[] = [];

  for (const figure of prose.querySelectorAll<HTMLElement>('figure.code')) {
    const code = figure.querySelector('pre')?.textContent ?? '';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy';
    button.textContent = 'Copy';
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        return;
      }
      button.textContent = 'Copied';
      timers.push(setTimeout(() => (button.textContent = 'Copy'), 1500));
    });
    figure.append(button);
  }

  return () => {
    for (const timer of timers) clearTimeout(timer);
    for (const button of prose.querySelectorAll('button.copy')) button.remove();
  };
}
