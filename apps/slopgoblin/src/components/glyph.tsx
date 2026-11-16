import type { SVGProps } from 'react';

/** The goblin's head in one color, its eyes cut out, as the extension draws it at text size. */
export function GoblinGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 4 32 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M16 4.8c3.3 0 6.2 1.4 7.8 4.1 2.5-2.1 5.2-3.3 7.4-3.4.6 0 .8.5.5 1.1-1.5 2.4-3.3 6.1-5.8 8.9.8 2.3.5 5.1-1.2 7.8-1.9 3-5.1 4.2-8.7 4.2s-6.8-1.2-8.7-4.2c-1.7-2.7-2-5.5-1.2-7.8C3.6 12.7 1.8 9 .3 6.6c-.3-.6-.1-1.1.5-1.1 1.4.1 2.8.5 4.2 1.2l.5 1.8 1.2-.9c.6.4 1.1.8 1.5 1.3 1.6-2.7 4.5-4.1 7.8-4.1ZM7.8 13.4c2.2-1.7 5.6-.9 7.2 1.8-1.5 3.1-5.6 3-7.2-1.8ZM24.2 13.4c-2.2-1.7-5.6-.9-7.2 1.8 1.5 3.1 5.6 3 7.2-1.8Z"
      />
    </svg>
  );
}
