import { useRef, useState } from 'react';

const swap =
  'col-start-1 row-start-1 transition duration-300 ease-out motion-reduce:transition-none';

function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="absolute top-1.5 right-2 grid cursor-pointer justify-items-end overflow-hidden rounded-md px-2 py-1.5 font-pixel text-pixel text-ink-faint opacity-0 transition group-hover:opacity-100 hover:bg-muted hover:text-ink-secondary focus-visible:opacity-100 pointer-coarse:opacity-100"
    >
      <span aria-hidden="true" className={`${swap} ${isCopied ? '-translate-y-2 opacity-0' : ''}`}>
        Copy
      </span>
      <span aria-hidden="true" className={`${swap} ${isCopied ? '' : 'translate-y-2 opacity-0'}`}>
        Copied
      </span>
      <span className="sr-only" aria-live="polite">
        {isCopied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
}

export function CodeBlock({ html, code, label }: { html: string; code: string; label: string }) {
  return (
    <figure className="group relative mb-5 rounded-[10px] bg-muted">
      {label && (
        <figcaption className="px-4 pt-3 font-pixel text-pixel text-ink-faint">{label}</figcaption>
      )}
      <div className={label ? undefined : '*:pt-3.5'} dangerouslySetInnerHTML={{ __html: html }} />
      <CopyButton text={code} />
    </figure>
  );
}
