import type { SVGProps } from 'react';

/** The app icon's mark, a ring with a wedge, in the text color. */
export default function Mark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="247 247 530 530" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M247 512 A265 265 0 1 0 777 512 A265 265 0 1 0 247 512 Z M305 512 A207 207 0 1 0 719 512 A207 207 0 1 0 305 512 Z"
      />
      <path d="M512 512 L512.0 343.0 A169 169 0 1 1 373.6 608.9 Z" />
    </svg>
  );
}
