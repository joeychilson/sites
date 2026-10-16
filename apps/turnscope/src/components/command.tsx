import { Fragment, type Ref, useRef, useState } from 'react';

export function Command({
  code,
  keepsLines = false,
  ref,
}: {
  code: string;
  keepsLines?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsCopied(false), 1800);
  };

  return (
    <div
      ref={ref}
      className="flex w-full items-start gap-3 rounded-xl bg-muted py-1.5 ps-4 pe-1.5 text-start"
    >
      <code
        className={`min-w-0 grow py-[5px] text-[13px]/[22px] tracking-normal ${keepsLines ? 'overflow-x-auto whitespace-pre' : 'wrap-break-word whitespace-pre-wrap'}`}
      >
        {keepsLines
          ? code
          : // A long path may break after any slash.
            code.split(/(?<=\/)/).map((part, index) => (
              <Fragment key={index}>
                {index > 0 && <wbr />}
                {part}
              </Fragment>
            ))}
      </code>
      <button
        type="button"
        onClick={copy}
        className="grid h-8 w-[74px] shrink-0 overflow-hidden rounded-full bg-thumb text-[13px] font-medium tracking-normal shadow-thumb transition-[background-color,scale] hover:bg-thumb-hover motion-safe:active:scale-96"
      >
        <span
          aria-hidden={isCopied}
          className={`col-start-1 row-start-1 self-center transition duration-300 ease-out ${isCopied ? 'opacity-0 motion-safe:-translate-y-3' : ''}`}
        >
          Copy
        </span>
        <span
          aria-hidden={!isCopied}
          className={`col-start-1 row-start-1 self-center transition duration-300 ease-out ${isCopied ? '' : 'opacity-0 motion-safe:translate-y-3'}`}
        >
          Copied
        </span>
      </button>
      <span aria-live="polite" className="sr-only">
        {isCopied ? 'Copied to the clipboard' : ''}
      </span>
    </div>
  );
}
