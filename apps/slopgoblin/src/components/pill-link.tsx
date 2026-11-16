const tones = {
  /** On the cream sheet. */
  primary: 'bg-fill text-on-fill hover:bg-fill-hover',
  /** On the green. */
  ground: 'bg-on-ground text-ground hover:bg-on-ground-hover',
};

const sizes = {
  small: 'h-9 px-4 text-[14px]',
  large: 'h-12 px-6 text-[16px]',
};

/** A rounded action link, styled for the surface it sits on. */
export function PillLink({
  href,
  tone,
  size,
  children,
}: {
  href: string;
  tone: keyof typeof tones;
  size: keyof typeof sizes;
  children: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap transition-[background-color,scale] duration-200 motion-safe:active:scale-96 ${tones[tone]} ${sizes[size]}`}
    >
      {children}
    </a>
  );
}
