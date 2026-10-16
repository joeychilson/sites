import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { useSyncExternalStore } from 'react';

import { media, tokens } from '../styles/tokens.stylex';

type LightsProps = {
  cells: typeof windows;
};

// A pixel city, 60 × 22 pixels. Each building is [x, width, height], standing on the street at
// row 21. The tallest stand 14 high, leaving the top rows to the sky.
const WIDTH = 60;
const HEIGHT = 22;
const STREET = 21;
// The warm light of a lit window.
const LAMP = '#f4c36a';

const back = [
  [1, 5, 8],
  [6, 4, 11],
  [10, 6, 10],
  [17, 5, 13],
  [23, 4, 9],
  [28, 6, 12],
  [35, 4, 14],
  [40, 5, 10],
  [46, 6, 13],
  [53, 6, 9],
];

const front = [
  [0, 6, 6],
  [7, 5, 9],
  [13, 4, 7],
  [18, 7, 11],
  [26, 5, 8],
  [32, 4, 6],
  [37, 6, 11],
  [44, 5, 8],
  [50, 4, 10],
  [55, 5, 7],
];

// The same "random" every time, so the server and the browser build the same city.
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = seededRandom(27);

// Windows every other pixel on the near buildings, and a few far ones. Those lit at night come on
// one by one as night falls.
const windows = [
  ...front.flatMap(([x, width, height]) => {
    const cells = [];
    for (let wx = x + 1; wx < x + width - 1; wx += 2) {
      for (let wy = STREET - height + 2; wy < STREET - 1; wy += 2) {
        cells.push({ x: wx, y: wy, isLit: random() < 0.45, isFar: false });
      }
    }
    return cells;
  }),
  ...back.flatMap(([x, width, height]) => {
    const cells = [];
    for (let wx = x + 1; wx < x + width - 1; wx += 2) {
      for (let wy = STREET - height + 2; wy < STREET - 1; wy += 3) {
        if (random() < 0.22) cells.push({ x: wx, y: wy, isLit: true, isFar: true });
      }
    }
    return cells;
  }),
].map((cell) => ({
  ...cell,
  delay: Math.round(300 + random() * 1300),
  isFlickering: random() < 0.08,
}));

const roofAt = (x: number) =>
  Math.min(
    STREET,
    ...[...back, ...front].flatMap(([bx, width, height]) =>
      x >= bx && x < bx + width ? [STREET - height] : [],
    ),
  );

const stars = Array.from({ length: 16 }, () => ({
  x: Math.floor(random() * WIDTH),
  y: Math.floor(random() * 7),
  delay: random() * 4,
  duration: 2.5 + random() * 3,
}))
  .filter((star) => star.y < roofAt(star.x) - 2)
  // No two touching, or they read as a dash.
  .filter((star, index, all) =>
    all
      .slice(0, index)
      .every((other) => Math.max(Math.abs(other.x - star.x), Math.abs(other.y - star.y)) > 1),
  );

// The sun and a full moon, five pixels across, drawn around their centers; `o` marks a crater.
const disc = (rows: Array<string>) =>
  rows.flatMap((row, y) =>
    row
      .split('')
      .flatMap((pixel, x) =>
        pixel === '.' ? [] : [{ x: x - 2, y: y - 2, isCrater: pixel === 'o' }],
      ),
  );
const sun = disc(['.###.', '#####', '#####', '#####', '.###.']);
const moon = disc(['.###.', '#o###', '####o', '##o##', '.###.']);

/** The city, which is also the switch between day and night. */
export default function Skyline() {
  const night = useSyncExternalStore(subscribe, isNightNow, () => null);
  const label =
    night === null ? 'Switch between day and night' : night ? 'Switch to day' : 'Switch to night';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => switchTheme(!night)}
      {...stylex.props(styles.button)}
    >
      {/* Three screen pixels to each of the city's, as for the name beneath it. */}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH * 3}
        height={HEIGHT * 3}
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {stars.map((star) => (
          <rect
            key={`${star.x},${star.y}`}
            x={star.x}
            y={star.y}
            width={1}
            height={1}
            {...stylex.props(styles.star, styles.twinkle(`${star.delay}s`, `${star.duration}s`))}
          />
        ))}

        <g {...stylex.props(styles.sky, styles.sun)}>
          {sun.map((pixel) => (
            <rect
              key={`${pixel.x},${pixel.y}`}
              x={47 + pixel.x}
              y={4 + pixel.y}
              width={1}
              height={1}
            />
          ))}
        </g>
        <g {...stylex.props(styles.sky, styles.moon)}>
          {moon.map((pixel) => (
            <rect
              key={`${pixel.x},${pixel.y}`}
              x={13 + pixel.x}
              y={4 + pixel.y}
              width={1}
              height={1}
              {...stylex.props(pixel.isCrater && styles.crater)}
            />
          ))}
        </g>

        <g {...stylex.props(styles.back)}>
          {back.map(([x, width, height]) => (
            <rect key={x} x={x} y={STREET - height} width={width} height={height} />
          ))}
          <rect x={36} y={STREET - 16} width={1} height={2} />
        </g>
        <Lights cells={windows.filter((cell) => cell.isFar)} />

        <g {...stylex.props(styles.front)}>
          {front.map(([x, width, height]) => (
            <rect key={x} x={x} y={STREET - height} width={width} height={height} />
          ))}
          <rect x={38} y={STREET - 12} width={4} height={1} />
          <rect x={39} y={STREET - 13} width={2} height={1} />
        </g>
        <Lights cells={windows.filter((cell) => !cell.isFar)} />

        <rect x={0} y={STREET} width={WIDTH} height={1} {...stylex.props(styles.street)} />

        <g {...stylex.props(styles.car, styles.eastbound)}>
          <rect x={0} y={STREET - 1} width={3} height={1} {...stylex.props(styles.carBody)} />
          <rect x={3} y={STREET - 1} width={1} height={1} {...stylex.props(styles.lamp)} />
        </g>
        <g {...stylex.props(styles.car, styles.westbound)}>
          <rect x={1} y={STREET - 1} width={3} height={1} {...stylex.props(styles.carBody)} />
          <rect x={0} y={STREET - 1} width={1} height={1} {...stylex.props(styles.lamp)} />
        </g>
      </svg>
    </button>
  );
}

/** A pane that turns with the page at once, and for one lit at night, a lamp that comes on in its own time. */
function Lights({ cells }: LightsProps) {
  return (
    <>
      {cells.map((cell) => (
        <g key={`${cell.x},${cell.y}`}>
          {!cell.isFar && (
            <rect x={cell.x} y={cell.y} width={1} height={1} {...stylex.props(styles.pane)} />
          )}
          {cell.isLit && (
            <rect
              x={cell.x}
              y={cell.y}
              width={1}
              height={1}
              {...stylex.props(
                styles.lamp,
                cell.isFar && styles.farLamp,
                cell.isFlickering && styles.flicker,
                styles.delay(`${cell.delay}ms`),
              )}
            />
          )}
        </g>
      ))}
    </>
  );
}

function subscribe(onChange: () => void) {
  const scheme = matchMedia('(prefers-color-scheme: dark)');
  const observer = new MutationObserver(onChange);
  scheme.addEventListener('change', onChange);
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
  return () => {
    scheme.removeEventListener('change', onChange);
    observer.disconnect();
  };
}

function isNightNow() {
  const { theme } = document.documentElement.dataset;
  return theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Saves the choice, or forgets it when it matches the system so the site follows the system again. */
function applyTheme(night: boolean) {
  const matchesSystem = night === matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = matchesSystem ? null : night ? 'dark' : 'light';
  const root = document.documentElement;
  if (theme) {
    root.dataset.theme = theme;
  } else {
    delete root.dataset.theme;
  }
  try {
    if (theme) {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  } catch {
    // Storage is unavailable in some private windows; the switch still applies to this page.
  }
}

function switchTheme(night: boolean) {
  if (
    typeof document.startViewTransition !== 'function' ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    applyTheme(night);
    return;
  }
  document.startViewTransition({
    update: () => applyTheme(night),
    types: ['theme', night ? 'night' : 'day'],
  });
}

const ink = (percent: number) =>
  `color-mix(in oklab, ${colorVars['--color-text-primary']} ${percent}%, ${colorVars['--color-background-body']})`;

const twinkleFrames = stylex.keyframes({
  from: { opacity: 0.2 },
  to: { opacity: 0.9 },
});

const flickerFrames = stylex.keyframes({
  '0%, 60%, 64%, 100%': { opacity: 1 },
  '62%': { opacity: 0.2 },
});

const driveEast = stylex.keyframes({
  from: { transform: 'translateX(-5px)' },
  to: { transform: 'translateX(64px)' },
});

const driveWest = stylex.keyframes({
  from: { transform: 'translateX(64px)' },
  to: { transform: 'translateX(-5px)' },
});

// Colors given as light-dark() are the day's, then the night's, so the city is right before any
// script runs. Only where the sun and moon stand follows --night.
const styles = stylex.create({
  button: {
    display: 'block',
    borderRadius: 4,
    scale: { default: 1, ':active': 0.98 },
    transitionProperty: 'scale',
    transitionDuration: '200ms',
    transitionTimingFunction: tokens.easeOut,
  },
  star: {
    fill: `light-dark(transparent, ${colorVars['--color-text-disabled']})`,
    opacity: 0.6,
    transitionProperty: 'fill',
    transitionDuration: '800ms',
    transitionDelay: '600ms',
    animationName: { default: twinkleFrames, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
  },
  twinkle: (delay: string, duration: string) => ({
    animationDelay: delay,
    animationDuration: duration,
  }),
  // The sun sets behind the city as the moon rises, and back.
  sky: {
    transitionProperty: 'translate, fill',
    // Without motion, the sun and moon trade places at once, and only their colors fade.
    transitionDuration: { default: '1100ms, 900ms', [media.reducedMotion]: '0s, 900ms' },
    transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1), ease',
  },
  sun: {
    translate: `0 calc(${tokens.night} * 20px)`,
    fill: 'light-dark(#f2a93b, transparent)',
  },
  moon: {
    translate: `0 calc((1 - ${tokens.night}) * 20px)`,
    fill: 'light-dark(transparent, #d4d9e4)',
  },
  crater: {
    fill: 'light-dark(transparent, #aab2c2)',
  },
  back: {
    fill: ink(7),
  },
  front: {
    fill: ink(15),
  },
  pane: {
    fill: ink(5),
  },
  street: {
    fill: ink(11),
  },
  lamp: {
    fill: `light-dark(transparent, ${LAMP})`,
    transitionProperty: 'fill',
    transitionDuration: '500ms',
  },
  farLamp: {
    fill: `light-dark(transparent, color-mix(in oklab, ${LAMP} 55%, transparent))`,
  },
  flicker: {
    animationName: { default: flickerFrames, [media.reducedMotion]: 'none' },
    animationDuration: '7s',
    animationTimingFunction: 'steps(1)',
    animationIterationCount: 'infinite',
  },
  delay: (delay: string) => ({
    transitionDelay: delay,
  }),
  car: {
    display: { default: null, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  eastbound: {
    animationName: driveEast,
    animationDuration: '11s',
  },
  westbound: {
    animationName: driveWest,
    animationDuration: '16s',
    animationDelay: '5s',
    animationFillMode: 'both',
  },
  carBody: {
    fill: ink(40),
  },
});
