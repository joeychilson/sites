import { GoblinGlyph } from '@/components/glyph';
import { PillLink } from '@/components/pill-link';
import { site } from '@/lib/site';

/** The green bar along the top, as in the side panel: the cream sheet scrolls up under it. */
export function Header() {
  return (
    <>
      <a
        href="#main"
        className="fixed top-4 left-4 z-50 -translate-y-[200%] rounded-full bg-on-ground px-4 py-2 text-[14px] font-medium text-ground focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 bg-ground">
        <div className="column flex h-16 items-center">
          <a
            href="/"
            className="flex items-center gap-2 font-display text-[19px] font-bold tracking-[-0.02em]"
          >
            <GoblinGlyph className="h-[15px] w-5" />
            {site.name}
          </a>
          <nav aria-label="Site" className="ms-auto flex items-center gap-6 text-[15px]">
            <a href={site.repo} className="underline-offset-4 hover:underline max-sm:hidden">
              GitHub
            </a>
            <PillLink href={site.store} tone="ground" size="small">
              Add to Chrome
            </PillLink>
          </nav>
        </div>
      </header>
    </>
  );
}
