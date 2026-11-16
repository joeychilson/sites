import { useEffect, useId, useRef } from 'react';

// The goblin from the extension's side panel (`src/sidepanel/Lurker.tsx` in the Slop Goblin repo),
// with the same drawing, sizes and moves. Its 108×84 drawing hangs on to the sheet's top edge,
// which cuts across it at y=50, right under the nose, so the fanged mouth stays tucked behind the
// sheet until the goblin lunges up to chomp. `zoom` scales it, and everything in it, up from the
// panel's size.

const HEAD =
  'M54 6C65.5 6 75.5 10.8 81.2 20.2 90 12.6 98.8 8.4 105.2 8.2c1.6 0 2.1 1.7 1 3.4-5 8.2-11.2 20.9-19.7 30.2 3 8 1.7 17.7-4.1 27C75.8 79.2 65.2 82.5 54 82.5S32.2 79.2 25.6 68.8c-5.8-9.3-7.1-19-4.1-27C13 32.5 6.8 19.8 1.8 11.6.7 9.9 1.2 8.2 2.8 8.2c4.8.2 9.6 2.1 14 4.8l1.4 5.8 4-2.8c2.3 1.3 3.6 2.7 4.6 4.2C32.5 10.8 42.5 6 54 6Z';
const EAR_INNER_L =
  'M24.2 25.5c-1.7-1.7-3.4-3.1-5-4.3l-3.4 1.6-1.3-6c-3.7-2.3-7-4-9.5-4.6 4.4 7.3 9.8 17.3 17.5 25.3.5-4.7 1-8.7 1.7-12Z';
const EAR_INNER_R =
  'M83.8 25.5c5.7-5.7 13-11.3 19.2-13.3-4.4 7.3-9.8 17.3-17.5 25.3-.5-4.7-1-8.7-1.7-12Z';
const EYES =
  'M26.5 35.5c6.5-5 17-3 22.5 5-4.8 9-18 8.6-22.5-5ZM81.5 35.5c-6.5-5-17-3-22.5 5 4.8 9 18 8.6 22.5-5Z';
const MOUTH = 'M33 54.5c10.5 4.5 31.5 4.5 42 0-2.8 12.5-11.5 18-21 18s-18.2-5.5-21-18Z';

/** Where the eyes sit in the drawing, and how far the irises can travel. */
const EYES_Y = 40.5 / 84;
const REACH = { x: 2.5, y: 1.35 };

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const outline = 'stroke-goblin-outline';
const rim = 'stroke-goblin-rim opacity-62';

/**
 * Watches the pointer, blinks now and then, and lunges up to chomp when `fed` goes up. Place it in
 * a positioned parent, as a sibling before a sheet with `relative z-1`: the head goes behind the
 * sheet, the hands in front. The panel's goblin also sleeps and covers its eyes; this one has no
 * call to.
 */
export function Goblin({ fed, className }: { fed: number; className: string }) {
  const drawing = useRef<SVGSVGElement>(null);
  const jaw = useRef<SVGGElement>(null);
  const hands = useRef<HTMLSpanElement>(null);
  const pupils = useRef<SVGGElement>(null);
  const glints = useRef<SVGGElement>(null);
  const brows = useRef<SVGGElement>(null);
  const lastFed = useRef(fed);
  // Its own ids for the drawing's gradients and clips.
  const uid = `goblin${useId().replace(/[^\w-]/g, '')}`;

  useEffect(() => {
    if (fed > lastFed.current && !reducedMotion()) {
      jaw.current?.animate(
        [
          { transform: 'none' },
          { transform: 'translateY(-14.5px) scale(0.98, 1.03)', offset: 0.28 },
          { transform: 'translateY(-10.5px) scale(1.04, 0.94)', offset: 0.5 },
          { transform: 'translateY(-13px) scale(0.99, 1.02)', offset: 0.68 },
          { transform: 'none' },
        ],
        { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      hands.current?.animate(
        [
          { transform: 'none' },
          { transform: 'translateY(1.5px) scaleY(0.92)', offset: 0.3 },
          { transform: 'translateY(-0.5px) scaleY(1.03)', offset: 0.65 },
          { transform: 'none' },
        ],
        { duration: 600, easing: 'ease-out' },
      );
    }
    lastFed.current = fed;
  }, [fed]);

  useEffect(() => {
    let frame = 0;
    const turn = (x: number, y: number) => {
      for (const [part, share] of [
        [pupils, { x: 1, y: 1 }],
        [glints, { x: 0.32, y: 0.32 }],
        [brows, { x: 0.24, y: 0.34 }],
      ] as const) {
        if (part.current) {
          part.current.style.transform = `translate(${x * share.x}px, ${y * share.y}px)`;
        }
      }
    };
    const look = (x: number, y: number) => {
      const box = drawing.current?.getBoundingClientRect();
      if (!box) {
        return;
      }
      const dx = x - (box.left + box.width / 2);
      const dy = y - (box.top + box.height * EYES_Y);
      const distance = Math.hypot(dx, dy) || 1;
      // Full reach once the pointer is a little way off; nearer, the eyes turn less.
      const reach = Math.min(distance / 140, 1);
      turn((dx / distance) * reach * REACH.x, (dy / distance) * reach * REACH.y);
    };
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => look(event.clientX, event.clientY));
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      turn(0, 0);
    };
    addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute top-0 w-[108px] ${className}`}>
      <svg
        ref={drawing}
        viewBox="0 0 108 84"
        className="absolute -top-[50px] left-0 z-0 h-[84px] w-[108px] overflow-visible"
      >
        <defs>
          <radialGradient id={`${uid}-skin`} cx="50%" cy="26%" r="68%" fx="46%" fy="20%">
            <stop offset="0%" className="[stop-color:var(--color-goblin-hi)]" />
            <stop offset="40%" className="[stop-color:var(--color-goblin-mid)]" />
            <stop offset="78%" className="[stop-color:var(--color-goblin-lo)]" />
            <stop offset="100%" className="[stop-color:var(--color-goblin-deep)]" />
          </radialGradient>
          <linearGradient id={`${uid}-hand-skin`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" className="[stop-color:var(--color-goblin-hi)]" />
            <stop offset="52%" className="[stop-color:var(--color-goblin-mid)]" />
            <stop offset="100%" className="[stop-color:var(--color-goblin-lo)]" />
          </linearGradient>
          <linearGradient id={`${uid}-ear-l`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4a647" />
            <stop offset="55%" stopColor="#7e8426" />
            <stop offset="100%" stopColor="#3c5b10" />
          </linearGradient>
          <linearGradient id={`${uid}-ear-r`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c4a647" />
            <stop offset="55%" stopColor="#7e8426" />
            <stop offset="100%" stopColor="#3c5b10" />
          </linearGradient>
          <radialGradient id={`${uid}-iris`} cx="48%" cy="44%" r="55%">
            <stop offset="0%" stopColor="#fff48a" />
            <stop offset="42%" stopColor="#ffca28" />
            <stop offset="80%" stopColor="#db7006" />
            <stop offset="100%" stopColor="#5c2802" />
          </radialGradient>
          <linearGradient id={`${uid}-sclera`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4ca9e" />
            <stop offset="32%" stopColor="#fcf8e8" />
            <stop offset="100%" stopColor="#f5eed3" />
          </linearGradient>
          <clipPath id={`${uid}-head-clip`}>
            <path d={HEAD} />
          </clipPath>
          <clipPath id={`${uid}-eyes-clip`}>
            <path d={EYES} />
          </clipPath>
          <clipPath id={`${uid}-mouth-clip`}>
            <path d={MOUTH} />
          </clipPath>
        </defs>

        {/* It peeks up from behind the sheet when the page opens. */}
        <g className="motion-safe:animate-rise">
          <g ref={jaw} className="origin-bottom transform-fill">
            <path d={HEAD} transform="translate(0 2)" fill="#0c1502" opacity="0.28" />

            <g clipPath={`url(#${uid}-head-clip)`}>
              <path d={HEAD} fill={`url(#${uid}-skin)`} />
              <path d={EAR_INNER_L} fill={`url(#${uid}-ear-l)`} />
              <path d={EAR_INNER_R} fill={`url(#${uid}-ear-r)`} />
              <path
                d="M10.5 16.5C14 23 18 29.5 22.8 33.8M97.5 16.5C94 23 90 29.5 85.2 33.8"
                fill="none"
                stroke="#d4e87b"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.48"
              />
              {/* Eye sockets and cheeks */}
              <ellipse
                cx="38"
                cy="39.5"
                rx="13"
                ry="9.2"
                transform="rotate(12 38 39.5)"
                fill="#1d3204"
                opacity="0.54"
              />
              <ellipse
                cx="70"
                cy="39.5"
                rx="13"
                ry="9.2"
                transform="rotate(-12 70 39.5)"
                fill="#1d3204"
                opacity="0.54"
              />
              <ellipse
                cx="29"
                cy="49"
                rx="7.5"
                ry="4.5"
                transform="rotate(18 29 49)"
                className="fill-goblin-hi opacity-28"
              />
              <ellipse
                cx="79"
                cy="49"
                rx="7.5"
                ry="4.5"
                transform="rotate(-18 79 49)"
                className="fill-goblin-hi opacity-28"
              />
              {/* Freckles and a scowl */}
              <circle cx="38" cy="19.5" r="1.35" fill="#36580d" opacity="0.5" />
              <circle cx="41.5" cy="17.2" r="0.9" fill="#36580d" opacity="0.42" />
              <path
                d="M51.2 30.5c.4 2.3.6 4.3.6 6M56.8 30.5c-.4 2.3-.6 4.3-.6 6"
                fill="none"
                stroke="#1e3305"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.68"
              />
              <path
                d={HEAD}
                transform="translate(0 1.8)"
                fill="none"
                strokeWidth="2.6"
                className={rim}
              />
            </g>

            <path
              d={HEAD}
              fill="none"
              strokeWidth="2.6"
              strokeLinejoin="round"
              className={outline}
            />

            <g clipPath={`url(#${uid}-eyes-clip)`}>
              <path d={EYES} fill={`url(#${uid}-sclera)`} />
              <g ref={pupils} className="transition-transform duration-170 ease-out">
                <circle cx="39.2" cy="40.5" r="7.4" fill={`url(#${uid}-iris)`} />
                <ellipse cx="39.5" cy="40.5" rx="2.9" ry="4.1" fill="#12100a" />
                <circle cx="41.8" cy="43.3" r="0.95" fill="#fff5ba" opacity="0.9" />
                <circle cx="68.8" cy="40.5" r="7.4" fill={`url(#${uid}-iris)`} />
                <ellipse cx="68.5" cy="40.5" rx="2.9" ry="4.1" fill="#12100a" />
                <circle cx="70.8" cy="43.3" r="0.95" fill="#fff5ba" opacity="0.9" />
              </g>
              <g ref={glints} className="transition-transform duration-170 ease-out">
                <ellipse
                  cx="36.6"
                  cy="37.5"
                  rx="2.1"
                  ry="1.3"
                  transform="rotate(-25 36.6 37.5)"
                  fill="#ffffff"
                />
                <ellipse
                  cx="66.2"
                  cy="37.5"
                  rx="2.1"
                  ry="1.3"
                  transform="rotate(-25 66.2 37.5)"
                  fill="#ffffff"
                />
              </g>
              {/* The upper lid, which sweeps down to blink */}
              <rect
                x="24"
                y="29"
                width="60"
                height="22"
                strokeWidth="1.6"
                className="origin-top scale-y-0 fill-goblin-mid stroke-goblin-outline transform-fill motion-safe:animate-blink"
              />
            </g>
            <path d={EYES} fill="none" strokeWidth="2" strokeLinejoin="round" className={outline} />
            <g ref={brows} className="transition-transform duration-170 ease-out">
              <path
                d="M25 31.8c7.5-3.7 17.5-1 24.8 6M83 31.8c-7.5-3.7-17.5-1-24.8 6"
                fill="none"
                stroke="#1e3305"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M25.8 30.3c7.2-3.4 16.7-.8 23.4 5.8M82.2 30.3c-7.2-3.4-16.7-.8-23.4 5.8"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="stroke-goblin-hi opacity-75"
              />
            </g>

            {/* A crooked nose, resting right at the sheet's edge */}
            <path
              d="M51.2 38.5c-1.4 4.7-4.4 8-4.8 10.7-.3 2.2 3.6 4 7.6 4.3 4-.3 7.9-2.1 7.6-4.3-.4-2.7-3.4-6-4.8-10.7Z"
              className="fill-goblin-lo"
            />
            <path
              d="M46.8 48.8c2 3.2 4.8 4.6 7.2 4.6s5.2-1.4 7.2-4.6"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              className={outline}
            />
            <path
              d="M50.8 39.5c-1.3 4-3.4 7-4 9.3M57.2 39.5c1.3 4 3.4 7 4 9.3"
              fill="none"
              stroke="#1e3305"
              strokeWidth="1.3"
              strokeLinecap="round"
              opacity="0.55"
            />
            <ellipse
              cx="50.2"
              cy="50.8"
              rx="1.5"
              ry="0.9"
              transform="rotate(18 50.2 50.8)"
              className="fill-goblin-outline"
            />
            <ellipse
              cx="57.8"
              cy="50.8"
              rx="1.5"
              ry="0.9"
              transform="rotate(-18 57.8 50.8)"
              className="fill-goblin-outline"
            />
            <path
              d="M53.6 39.2c-.5 4-.6 7.6 0 10.6"
              fill="none"
              strokeWidth="1.9"
              strokeLinecap="round"
              className={rim}
            />

            {/* The fanged mouth, behind the sheet until it chomps */}
            <g clipPath={`url(#${uid}-mouth-clip)`}>
              <path d={MOUTH} fill="#22100d" />
              <ellipse cx="54" cy="71.5" rx="12" ry="5.5" fill="#963b2c" />
              <path d="M46 56l2.8 5.5 2.8-4.8 2.8 4.8 2.8-5 2.8 4.6 2.6-5.6Z" fill="#f5f0da" />
              <path d="M38 68.5 42 56.5 46 69.5ZM62 69.5 66 56 70 68.5Z" fill="#fffdf2" />
            </g>
            <path
              d={MOUTH}
              fill="none"
              strokeWidth="2"
              strokeLinejoin="round"
              className={outline}
            />
          </g>
        </g>
      </svg>

      <span
        ref={hands}
        className="absolute -top-[7px] left-0 z-2 flex w-[108px] justify-between px-[7px] motion-safe:animate-grip"
      >
        <Hand uid={uid} />
        <Hand uid={uid} mirrored />
      </span>
    </div>
  );
}
/** Three clawed fingers curled over the sheet's edge. */
function Hand({
  uid,
  mirrored = false,
}: {
  /** The goblin's ids, for its hands' gradient. */
  uid: string;
  mirrored?: boolean;
}) {
  return (
    <svg viewBox="0 0 28 18" width="28" height="18" overflow="visible" className="block">
      <g transform={mirrored ? 'scale(-1 1) translate(-28 0)' : undefined}>
        <ellipse cx="14" cy="12.5" rx="13" ry="4.5" className="fill-goblin-hand-shadow" />
        {[
          'M2 6.5c-.5-4 5.5-4.7 6.2-.7l.6 5.7c.1 2.5-5.6 2.7-6.3 0Z',
          'M9.8 5.2C9.6 1 16.4 1 16.6 5.2l.2 7c0 2.6-6.6 2.6-6.8 0Z',
          'M18 6c.2-4 6.5-3.6 6.4.4l-.6 5.4c-.3 2.4-5.6 2.2-5.8-.3Z',
        ].map((finger) => (
          <path
            key={finger}
            d={finger}
            fill={`url(#${uid}-hand-skin)`}
            strokeWidth="1.6"
            strokeLinejoin="round"
            className={outline}
          />
        ))}
        {[
          'M4.2 11.5 5.6 15.2 7.2 11.4Z',
          'M11.8 12.2 13.4 16.2 15 12.2Z',
          'M19.4 11.6 20.8 15.2 22.4 11.5Z',
        ].map((claw) => (
          <path
            key={claw}
            d={claw}
            fill="#f2ecd5"
            strokeWidth="1.1"
            strokeLinejoin="round"
            className={outline}
          />
        ))}
        <ellipse cx="5.4" cy="5.2" rx="1.6" ry="0.9" className="fill-goblin-rim opacity-58" />
        <ellipse cx="13.2" cy="4.2" rx="1.8" ry="1" className="fill-goblin-rim opacity-58" />
        <ellipse cx="21.2" cy="5.2" rx="1.6" ry="0.9" className="fill-goblin-rim opacity-58" />
      </g>
    </svg>
  );
}
