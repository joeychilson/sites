import { site } from '@/lib/site';

const links = [
  { label: 'Source', href: site.repo },
  { label: 'Privacy policy', href: `${site.repo}/blob/main/PRIVACY.md` },
  { label: 'License', href: `${site.repo}/blob/main/LICENSE` },
];

export function Footer() {
  return (
    <footer className="column py-12 text-[14px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
        <p>
          Made by{' '}
          <a
            href={site.author.href}
            className="underline decoration-on-ground/40 underline-offset-4 transition-colors hover:decoration-on-ground"
          >
            {site.author.name}
          </a>
        </p>
        <nav aria-label="Project" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((item) => (
            <a key={item.href} href={item.href} className="underline-offset-4 hover:underline">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mt-4 text-[13px]">Not made by, or connected to, X or Google.</p>
    </footer>
  );
}
