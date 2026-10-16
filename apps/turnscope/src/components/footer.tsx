import { Mark } from '@/components/logo';
import { site } from '@/lib/site';

const links = [
  { label: 'Source', href: site.repo },
  { label: 'Releases', href: `${site.repo}/releases` },
  { label: 'Issues', href: `${site.repo}/issues` },
  { label: 'License', href: `${site.repo}/blob/main/LICENSE` },
];

export function Footer() {
  return (
    <footer className="column pt-24 pb-14 text-[13px] text-ink-faint sm:pt-32">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <Mark width={12} height={12} className="text-ink-fainter" />
          <span>
            Made by{' '}
            <a
              href={site.author.href}
              className="text-ink-secondary transition-colors hover:text-ink"
            >
              {site.author.name}
            </a>
          </span>
        </p>
        <nav aria-label="Project" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mt-6">Agent names and logos belong to their owners.</p>
    </footer>
  );
}
