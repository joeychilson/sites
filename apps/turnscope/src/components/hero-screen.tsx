import { useState } from 'react';

import { Glyph } from '@/components/glyph';
import { MenuBarItem } from '@/components/panel/menu-bar-item';
import { Panel } from '@/components/panel/panel';
import { Terminal, Turn } from '@/components/terminal';
import { inUse } from '@/lib/demo';

export function HeroScreen() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  // Each opening starts the panel fresh with nothing open, as the app does. Only the first, on
  // arrival, opens an account, so the page shows its limits.
  const [openings, setOpenings] = useState(0);

  const toggle = () => {
    if (!isPanelOpen) {
      setOpenings(openings + 1);
    }
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <figure className="@container mx-auto w-full max-w-280">
      <figcaption className="sr-only">
        A Mac at 7 AM. Asked to use subagents, Claude Code asks Turnscope whether 2 hours of work
        fit. About 1 hour 10 minutes of work is left before its 5-hour limit runs out, so it writes
        the tests itself. Turnscope’s panel, open from the menu bar, says Claude Max runs out in 1
        hour and is back in 3, and shows each of its limits.
      </figcaption>
      {/* Drawn at the Mac's size and zoomed to fit: tan(atan2()) turns the ratio of two lengths
          into the plain number zoom needs. */}
      <div className="relative h-185 w-280 [zoom:min(1,tan(atan2(100cqw,1120px)))] overflow-hidden rounded-[22px] wallpaper shadow-screen max-sm:h-auto max-sm:w-auto max-sm:[zoom:1] max-sm:pb-8">
        <div className="relative z-1 flex h-8 cursor-default items-center gap-1 bg-[rgb(0_0_0/0.2)] px-2.5 text-[13px] tracking-normal text-label backdrop-blur-md">
          <span aria-hidden="true" className="flex gap-1 *:px-2 max-sm:hidden">
            <span className="font-bold">Terminal</span>
            <span>Shell</span>
            <span>Edit</span>
            <span>View</span>
          </span>
          <span className="grow" />
          <button
            type="button"
            aria-label="Turnscope"
            aria-expanded={isPanelOpen}
            aria-controls="turnscope-panel"
            onClick={toggle}
            className="flex h-6 items-center rounded-md px-2 transition-colors duration-100 aria-expanded:bg-[rgb(255_255_255/0.18)]"
          >
            {inUse.map((account) => (
              <MenuBarItem
                key={account.id}
                logo={account.logo}
                figure={account.menuBarFigure ?? account.figure}
                standing={account.standing}
              />
            ))}
          </button>
          <span aria-hidden="true" className="flex px-1.5">
            <Glyph name="wifi" />
          </span>
          <span aria-hidden="true" className="flex px-1.5">
            <Glyph name="controls" />
          </span>
          <span aria-hidden="true" className="px-2 tabular-nums max-sm:hidden">
            Thu Oct 8 7:00 AM
          </span>
        </div>

        <div className="absolute top-39 left-14 w-140 max-sm:hidden">
          <Terminal title="app — claude" streams>
            <Turn mark=">" kind="asked">
              Use subagents to write the parser's tests.
            </Turn>
            <Turn mark="●">
              <strong>turnscope - check_limits</strong> (MCP)(hours: 2)
            </Turn>
            <Turn mark="⎿" kind="output">
              2 more hours of work don't fit: 5 hours runs out after about 1h 10m of work.
              <br />
              Claude Max (me@example.com): about 1h 10m of work left (40m–2h 10m) before 5 hours
              runs out; it resets 10:00 (in 3h).
              <br />
              <span className="text-ink-faint">… +5 lines (ctrl+o to expand)</span>
            </Turn>
            <Turn mark="●">
              That's about an hour of work, too little for subagents. I'll write the tests myself.
            </Turn>
          </Terminal>
        </div>

        {/* Where the app puts it: under its menu bar item, 6 points below the menu bar. */}
        <div
          id="turnscope-panel"
          inert={!isPanelOpen}
          className={`absolute top-[38px] right-[73px] max-sm:static max-sm:flex max-sm:justify-center max-sm:px-3 max-sm:pt-2 ${isPanelOpen ? 'visible opacity-100 [transition:opacity_140ms,visibility_0s]' : 'invisible opacity-0 [transition:opacity_100ms,visibility_0s_100ms]'}`}
        >
          <Panel key={openings} initiallyOpen={openings === 0 ? 'claude' : undefined} />
        </div>
      </div>
    </figure>
  );
}
