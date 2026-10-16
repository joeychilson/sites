import { Glyph } from '@/components/glyph';
import type { LogoName } from '@/components/logo';
import { MenuBarItem } from '@/components/panel/menu-bar-item';
import { ink } from '@/components/panel/standing';
import type { Standing } from '@/lib/demo';

// Most urgent first, as the menu bar orders them.
const figures: { logo: LogoName; figure: string; standing: Standing; text: string }[] = [
  {
    logo: 'xai',
    figure: 'Back 5:40 AM',
    standing: 'usedUp',
    text: 'Used up. Shows when it’s back.',
  },
  {
    logo: 'openai',
    figure: '1h 40m',
    standing: 'runningOut',
    text: 'Runs out before it resets. Counts down the last 3 hours.',
  },
  {
    logo: 'anthropic',
    figure: '68%',
    standing: 'lasts',
    text: 'Lasts until it resets. Shows what’s left.',
  },
];

export function MenuBarGlance() {
  return (
    <>
      <div aria-hidden="true" className="h-22 overflow-hidden rounded-2xl wallpaper-strip">
        <div className="flex h-9 items-center justify-end gap-1 bg-[rgb(0_0_0/0.2)] px-3 text-[13px] tracking-normal whitespace-nowrap text-label *:shrink-0 *:px-1.5">
          {figures.map((each) => (
            <span key={each.figure} className="flex">
              <MenuBarItem logo={each.logo} figure={each.figure} standing={each.standing} />
            </span>
          ))}
          <span className="flex max-sm:hidden">
            <Glyph name="wifi" />
          </span>
          <span className="flex max-sm:hidden">
            <Glyph name="controls" />
          </span>
          <span className="tabular-nums max-sm:hidden">Thu 7:00 AM</span>
        </div>
      </div>
      <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-3">
        {figures.map((each) => (
          <li key={each.figure}>
            <p
              className={`text-[20px]/[1.4] font-semibold tracking-[-0.01em] tabular-nums ${ink[each.standing]}`}
            >
              {each.figure}
            </p>
            <p className="mt-1 body-text">{each.text}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
