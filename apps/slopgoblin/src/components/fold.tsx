import type { ReactNode } from 'react';

/**
 * Opens to its content's height, or closes to nothing, gliding either way. It clips a few pixels
 * out from its content rather than at its edge, so a focus ring around a link at the bottom shows.
 */
export function Fold({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      inert={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-360 ease-glide motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0'}`}
    >
      <div className="min-h-0 overflow-clip [overflow-clip-margin:4px]">{children}</div>
    </div>
  );
}
