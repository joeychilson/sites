const sizes = {
  small: 'h-8 px-4 text-[13px]',
  large: 'h-11 px-[22px] text-[15px]',
};

export function PillLink({
  href,
  size,
  children,
}: {
  href: string;
  size: keyof typeof sizes;
  children: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full bg-accent font-semibold tracking-[-0.01em] whitespace-nowrap text-on-accent transition-[background-color,scale] hover:bg-accent-hover motion-safe:active:scale-97 ${sizes[size]}`}
    >
      {children}
    </a>
  );
}
