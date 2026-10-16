import type { ReactNode } from 'react';

import appIcon from '@/assets/app-icon-dark.webp';
import { LimitLine } from '@/components/panel/account-row';
import { LimitBar } from '@/components/panel/limit-bar';
import { inUse } from '@/lib/demo';

export function ForecastTiles() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      <Tile
        title="When it runs out"
        text="Whether each limit lasts until it resets, or when it runs out at your pace."
      >
        <span className="w-full text-[13px]/4">
          <LimitLine limit={inUse[0].limits[0]} growth="in-view" />
        </span>
      </Tile>
      <Tile
        title="Hours of work left"
        text="How much agent work a limit has left, with an 80% range."
      >
        <span className="flex flex-col gap-1 text-[13px]/4">
          <span className="text-[40px]/[1.1] font-semibold tracking-[-0.03em] tabular-nums">
            1h 10m
          </span>
          <span className="text-label-secondary">of work left · 40m–2h 10m</span>
        </span>
      </Tile>
      <Tile title="What used it" text="Usage and cost by session, project, model or agent.">
        <span className="flex w-full flex-col gap-4">
          <Session title="Fix the parser" percent={32} />
          <Session title="Write the release notes" percent={9} />
        </span>
      </Tile>
      <Tile
        title="Notifications"
        text="Before a limit runs out, when it’s used up, and when it’s back."
      >
        <span className="flex w-full items-start gap-2.5 rounded-[18px] bg-glass px-3.5 py-3 text-[13px]/[17px] shadow-notification">
          <img src={appIcon} alt="" width={36} height={36} className="shrink-0" />
          <span className="flex min-w-0 grow flex-col">
            <span className="flex justify-between font-semibold">
              Claude Max <span className="font-normal text-label-secondary">now</span>
            </span>
            <span>5 hours runs out 8 AM</span>
            <span className="text-label-secondary">Back 10 AM.</span>
          </span>
        </span>
      </Tile>
    </ul>
  );
}

function Tile({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <li className="rounded-[20px] bg-muted p-6 sm:p-8">
      {/* As tall as the tallest, the notification, so every tile's text starts at one height. */}
      <div aria-hidden="true" className="mb-6 flex h-19 items-center tracking-normal text-label">
        {children}
      </div>
      <h3 className="text-[17px]/[1.4] font-semibold tracking-[-0.01em]">{title}</h3>
      <p className="mt-1.5 body-text">{text}</p>
    </li>
  );
}

function Session({ title, percent }: { title: string; percent: number }) {
  return (
    <span className="flex flex-col gap-[7px]">
      <span className="flex justify-between gap-3 text-[13px]/4 whitespace-nowrap tabular-nums">
        <span>{title}</span>
        <span className="text-label-secondary">{percent}%</span>
      </span>
      <LimitBar percent={percent} standing="lasts" growth="in-view" />
    </span>
  );
}
