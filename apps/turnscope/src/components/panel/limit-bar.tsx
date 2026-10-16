import { fill } from '@/components/panel/standing';
import type { Standing } from '@/lib/demo';

// In the panel, a bar fills each time its row opens, as the app's does. On the page, it fills as it
// scrolls into view.
const growths = {
  now: 'motion-safe:animate-fill',
  'in-view': 'fill-in-view',
  none: '',
};

export type Growth = keyof typeof growths;

export function LimitBar({
  percent,
  standing,
  growth,
}: {
  percent: number;
  standing: Standing;
  growth: Growth;
}) {
  return (
    <span aria-hidden="true" className="relative block h-[5px] rounded-full bg-label-quaternary">
      {percent > 0 && (
        <span
          // No narrower than it's tall, so a sliver still reads as a bar.
          style={{ width: `max(5px, ${percent}%)` }}
          className={`absolute inset-y-0 left-0 rounded-full ${fill[standing]} ${growths[growth]}`}
        />
      )}
    </span>
  );
}
