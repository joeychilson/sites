import type { ReactNode } from 'react';

// Spans only, so it can sit inside a button. What goes in it must be spans too.
export function Collapse({ isOpen, children }: { isOpen: boolean; children: ReactNode }) {
  return (
    <span
      className={`grid transition-[grid-template-rows] duration-(--spring) ease-spring motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
    >
      <span data-shown={isOpen || undefined} className="appears block min-h-0 overflow-hidden">
        {children}
      </span>
    </span>
  );
}
