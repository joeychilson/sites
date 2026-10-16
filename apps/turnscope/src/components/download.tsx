import { PillLink } from '@/components/pill-link';
import { site } from '@/lib/site';

export function Download() {
  return (
    <>
      <div className="mt-10 flex justify-center">
        <PillLink href="/download" size="large">
          Download for Mac
        </PillLink>
      </div>
      <p className="mt-4 text-[13px] text-ink-faint">
        Free and open source · {site.requires} · Apple silicon or Intel
      </p>
    </>
  );
}
