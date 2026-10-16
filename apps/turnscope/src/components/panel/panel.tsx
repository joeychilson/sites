import { useState } from 'react';

import { Glyph } from '@/components/glyph';
import { AccountRow } from '@/components/panel/account-row';
import { Collapse } from '@/components/panel/collapse';
import { type Account, inUse, notUsed, usedThisWeek, verdict } from '@/lib/demo';

// One account opens at a time, and the rest close, as in the app.
export function Panel({ initiallyOpen }: { initiallyOpen?: string }) {
  const [openId, setOpenId] = useState(initiallyOpen);
  const [showsMore, setShowsMore] = useState(false);

  const row = (account: Account) => (
    <span key={account.id} className="block pt-1">
      <AccountRow
        account={account}
        isOpen={openId === account.id}
        onToggle={() => setOpenId(openId === account.id ? undefined : account.id)}
      />
    </span>
  );

  const toggleMore = () => {
    if (showsMore && notUsed.some((account) => account.id === openId)) {
      setOpenId(undefined);
    }
    setShowsMore(!showsMore);
  };

  return (
    <div className="w-[340px] max-w-full cursor-default overflow-hidden rounded-[14px] bg-glass text-start tracking-normal text-label subpixel-antialiased shadow-panel backdrop-blur-[30px] backdrop-saturate-150 select-none">
      <div className="px-5 pt-[18px] pb-3.5">
        <p className="text-[20px]/6 font-semibold text-warning">{verdict.headline}</p>
        <p className="mt-1 text-[13px]/4 text-label-secondary">{verdict.detail}</p>
      </div>

      {/* Pulled up, so the first row sits right under the headline. */}
      <div className="-mt-1 px-2">
        {inUse.map(row)}
        <div className="pt-2">
          <p className="px-3 py-1 text-[11px]/[14px] font-semibold text-label-secondary">
            Used this week
          </p>
          {usedThisWeek.map(row)}
        </div>
        <div className="pt-1">
          <button
            type="button"
            aria-expanded={showsMore}
            onClick={toggleMore}
            className="group flex w-full items-center gap-2 rounded-[10px] px-3 py-[7px] -outline-offset-2 transition-colors duration-120 ease-out hover:bg-row"
          >
            <span className="grow text-start text-[12px]/[15px] text-label-secondary">
              {`${notUsed.length} more accounts`}
            </span>
            <span className="flex text-label-tertiary transition-[rotate] duration-(--spring) ease-spring group-aria-expanded:rotate-90 motion-reduce:transition-none">
              <Glyph name="chevron" />
            </span>
          </button>
          <Collapse isOpen={showsMore}>{notUsed.map(row)}</Collapse>
        </div>
      </div>

      <div aria-hidden="true" className="flex justify-end gap-0.5 p-2 text-label-secondary">
        <span className="grid size-7 place-items-center">
          <Glyph name="gearshape" />
        </span>
        <span className="grid size-7 place-items-center">
          <Glyph name="power" />
        </span>
      </div>
    </div>
  );
}
