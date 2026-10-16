import { Mark } from '@/components/logo';
import { PillLink } from '@/components/pill-link';
import { site } from '@/lib/site';

const links = [
  { label: 'For agents', href: '/#agents' },
  { label: 'Privacy', href: '/#privacy' },
  { label: 'Install', href: '/#install' },
  { label: 'GitHub', href: site.repo },
];

export function Header() {
  return (
    <>
      <a
        href="#main"
        className="fixed top-4 left-4 z-50 -translate-y-[200%] rounded-full bg-popover px-4 py-2 text-[15px] focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 edge-on-scroll bg-page/72 backdrop-blur-[20px] backdrop-saturate-180">
        <div className="column flex h-16 items-center">
          <a href="/" className="flex items-center gap-2 text-[15px] font-semibold">
            <Mark width={16} height={16} />
            {site.name}
          </a>
          <nav
            aria-label="Site"
            className="ms-auto flex items-center gap-7 text-[14px] text-ink-secondary"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-ink max-sm:hidden"
              >
                {link.label}
              </a>
            ))}
            <PillLink href="/download" size="small">
              Download
            </PillLink>
          </nav>
        </div>
      </header>
    </>
  );
}
