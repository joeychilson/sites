import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { toggleNight } from '../night';
import { city, media } from '../styles/tokens.stylex';

type Building = readonly [x: number, width: number, height: number];

type Light = {
  x: number;
  y: number;
  isLit: boolean;
  isFar: boolean;
  /** How long after nightfall it lights, in milliseconds. */
  delay: number;
  isFlickering: boolean;
};

// The city is 60 by 22 pixels, standing on a street along the bottom row. No building is taller than
// 14, which leaves the top rows to the sky.
const WIDTH = 60;
const HEIGHT = 22;
const STREET = 21;
const LAMP = '#f4c36a';

const back: ReadonlyArray<Building> = [
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

const front: ReadonlyArray<Building> = [
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

// Seeded, so the server and the browser build the same city. Every draw below comes in a fixed
// order, which is what keeps it the same city from one build to the next.
const random = (() => {
  let seed = 27;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

/** A grid of windows inside each building, a column apart and `rowStep` rows apart. */
function windowCells(buildings: ReadonlyArray<Building>, rowStep: number) {
  return buildings.flatMap(([x, width, height]) => {
    const cells = [];
    for (let column = x + 1; column < x + width - 1; column += 2) {
      for (let row = STREET - height + 2; row < STREET - 1; row += rowStep) {
        cells.push({ x: column, y: row });
      }
    }
    return cells;
  });
}

const nearWindows = windowCells(front, 2).map((cell) => ({
  ...cell,
  isLit: random() < 0.45,
  isFar: false,
}));
const farWindows = windowCells(back, 3)
  .filter(() => random() < 0.22)
  .map((cell) => ({ ...cell, isLit: true, isFar: true }));
const lights: ReadonlyArray<Light> = [...nearWindows, ...farWindows].map((cell) => ({
  ...cell,
  delay: Math.round(300 + random() * 1300),
  isFlickering: random() < 0.08,
}));

const roofAt = (x: number) =>
  Math.min(
    STREET,
    ...[...back, ...front].flatMap(([left, width, height]) =>
      x >= left && x < left + width ? [STREET - height] : [],
    ),
  );

const stars = Array.from({ length: 16 }, () => ({
  x: Math.floor(random() * WIDTH),
  y: Math.floor(random() * 7),
  delay: random() * 4,
  duration: 2.5 + random() * 3,
}))
  .filter((star) => star.y < roofAt(star.x) - 2)
  // Two touching stars read as a dash.
  .filter((star, index, all) =>
    all
      .slice(0, index)
      .every((other) => Math.max(Math.abs(other.x - star.x), Math.abs(other.y - star.y)) > 1),
  );

/** Pixels around a center, from rows of `#` and `o` (a crater). */
const disc = (rows: ReadonlyArray<string>) =>
  rows.flatMap((row, y) =>
    Array.from(row).flatMap((pixel, x) =>
      pixel === '.' ? [] : [{ x: x - 2, y: y - 2, isCrater: pixel === 'o' }],
    ),
  );

const sun = disc(['.###.', '#####', '#####', '#####', '.###.']);
const moon = disc(['.###.', '#o###', '####o', '##o##', '.###.']);

export default function Skyline() {
  return (
    <button
      type="button"
      aria-label="Switch between day and night"
      title="Switch between day and night"
      onClick={toggleNight}
      {...stylex.props(styles.button)}
    >
      {/* Three screen pixels to each of the city's, like the name beneath it. */}
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

        <g {...stylex.props(styles.body, styles.sun)}>
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
        <g {...stylex.props(styles.body, styles.moon)}>
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

        <g {...stylex.props(styles.far)}>
          <Buildings buildings={back} />
          {/* An antenna. */}
          <rect x={36} y={STREET - 16} width={1} height={2} />
        </g>
        <Lights lights={lights.filter((light) => light.isFar)} />

        <g {...stylex.props(styles.near)}>
          <Buildings buildings={front} />
          {/* A stepped roof. */}
          <rect x={38} y={STREET - 12} width={4} height={1} />
          <rect x={39} y={STREET - 13} width={2} height={1} />
        </g>
        <Lights lights={lights.filter((light) => !light.isFar)} />

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

function Buildings({ buildings }: { buildings: ReadonlyArray<Building> }) {
  return buildings.map(([x, width, height]) => (
    <rect key={x} x={x} y={STREET - height} width={width} height={height} />
  ));
}

// Near windows show their glass by day; far ones are too small to.
function Lights({ lights }: { lights: ReadonlyArray<Light> }) {
  return lights.map((light) => (
    <g key={`${light.x},${light.y}`}>
      {!light.isFar && (
        <rect x={light.x} y={light.y} width={1} height={1} {...stylex.props(styles.pane)} />
      )}
      {light.isLit && (
        <rect
          x={light.x}
          y={light.y}
          width={1}
          height={1}
          {...stylex.props(
            styles.lamp,
            light.isFar && styles.farLamp,
            light.isFlickering && styles.flicker,
            styles.delay(`${light.delay}ms`),
          )}
        />
      )}
    </g>
  ));
}

/** The page's text color, mixed into its background. */
const ink = (percent: number) =>
  `color-mix(in oklab, ${colorVars['--color-text-primary']} ${percent}%, ${colorVars['--color-background-body']})`;

const twinkle = stylex.keyframes({
  from: { opacity: 0.2 },
  to: { opacity: 0.9 },
});

const flicker = stylex.keyframes({
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

// Colors in light-dark() are the day's, then the night's, so the city is right before any script
// runs. Only where the sun and moon stand follows --night, so they can rise and set.
const styles = stylex.create({
  button: {
    display: 'block',
    borderRadius: 4,
    scale: { default: 1, ':active': 0.98 },
    transitionProperty: 'scale',
    transitionDuration: { default: '200ms', [media.reducedMotion]: '0s' },
    transitionTimingFunction: city.easeOut,
  },
  star: {
    fill: `light-dark(transparent, ${colorVars['--color-text-disabled']})`,
    opacity: 0.6,
    transitionProperty: 'fill',
    transitionDuration: '800ms',
    transitionDelay: '600ms',
    animationName: { default: twinkle, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
  },
  twinkle: (delay: string, duration: string) => ({
    animationDelay: delay,
    animationDuration: duration,
  }),
  body: {
    transitionProperty: 'translate, fill',
    transitionDuration: { default: '1100ms, 900ms', [media.reducedMotion]: '0s, 900ms' },
    transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1), ease',
  },
  sun: {
    translate: `0 calc(${city.night} * 20px)`,
    fill: 'light-dark(#f2a93b, transparent)',
  },
  moon: {
    translate: `0 calc((1 - ${city.night}) * 20px)`,
    fill: 'light-dark(transparent, #d4d9e4)',
  },
  crater: {
    fill: 'light-dark(transparent, #aab2c2)',
  },
  far: {
    fill: ink(7),
  },
  near: {
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
    animationName: { default: flicker, [media.reducedMotion]: 'none' },
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
