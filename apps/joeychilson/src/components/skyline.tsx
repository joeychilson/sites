import { toggleTheme } from '@/lib/theme';

// 60 × 22 pixels. b: far building, w: far window, B: near building, o: window, L: window
// with a lamp, =: street. Far windows hidden behind near buildings are left out.
const city = `
............................................................
............................................................
............................................................
............................................................
............................................................
....................................b.......................
....................................b.......................
...................................bbbb.....................
.................bbbbb.............bbbbBB.....bbbbbb........
.................bbbbb......bbbbbb.bwbBBBB....bbbbbb........
......bbbb.......bBBBBBBB...bbbbbb.bbBBBBBB...bwbbbb........
......bbbbbbbbbb.bBBBBBBB...bbbbbb.bbBBBBBBbb.bbbbBBBB......
......bBBBBBbbbb.bBoBoBoBbb.bbbbbb.bbBLBoBBbb.bbbbBBBBbbbbb.
.bbbbbbBBBBBbbbb.bBBBBBBBbBBBBBbbb.bbBBBBBBbBBBBBbBoBBbbbbb.
.bbbbbbBoBLBbBBBBbBLBLBLBbBBBBBwbb.bbBoBLBBbBBBBBbBBBBbBBBBB
BBBBBBbBBBBBbBBBBbBBBBBBBbBoBLBbBBBBbBBBBBBbBLBoBbBoBBbBBBBB
BBBBBBbBLBoBbBLBBbBLBoBoBbBBBBBbBBBBbBLBoBBbBBBBBbBBBBbBLBoB
BLBLBBbBBBBBbBBBBbBBBBBBBbBLBLBbBoBBbBBBBBBbBLBoBbBLBBwBBBBB
BBBBBBbBLBoBbBoBBbBLBoBLBbBBBBBbBBBBbBoBoBBbBBBBBbBBBBbBLBLB
BLBLBBbBBBBBbBBBBbBBBBBBBbBLBLBbBoBBbBBBBBBbBLBLBbBoBBbBBBBB
BBBBBBbBBBBBbBBBBbBBBBBBBbBBBBBbBBBBbBBBBBBbBBBBBbBBBBbBBBBB
============================================================
`
  .trim()
  .split('\n');

const disc = ['.###.', '#####', '#####', '#####', '.###.'];
const craters = [
  [1, 1],
  [4, 2],
  [2, 3],
];

const stars = [
  [18, 4],
  [50, 2],
  [51, 0],
  [53, 6],
  [34, 6],
  [12, 6],
  [9, 5],
  [8, 0],
  [30, 3],
  [27, 2],
  [0, 5],
  [41, 0],
  [58, 6],
  [21, 0],
];

interface Pixel {
  x: number;
  y: number;
}

interface Run extends Pixel {
  width: number;
}

function runs(rows: string[], chars: string): Run[] {
  return rows.flatMap((row, y) =>
    [...row.matchAll(new RegExp(`[${chars}]+`, 'g'))].map((match) => ({
      x: match.index,
      y,
      width: match[0].length,
    })),
  );
}

function pixels(rows: string[], char: string): Pixel[] {
  return runs(rows, char).flatMap(({ x, y, width }) =>
    Array.from({ length: width }, (_, i) => ({ x: x + i, y })),
  );
}

// A fixed scatter, so lamps come on one by one in the same order on every visit.
const lampDelay = ({ x, y }: Pixel) => 450 + ((x * 37 + y * 101) % 1100);

const shapes = {
  far: runs(city, 'bw'),
  near: runs(city, 'BoL'),
  windows: runs(city, 'oL'),
  street: runs(city, '='),
  lamps: pixels(city, 'L'),
  farLamps: pixels(city, 'w'),
  disc: runs(disc, '#'),
};

function Rects({ runs, className }: { runs: Run[]; className?: string }) {
  return runs.map(({ x, y, width }) => (
    <rect key={`${x},${y}`} x={x} y={y} width={width} height={1} className={className} />
  ));
}

function Lamps({ pixels, className }: { pixels: Pixel[]; className: string }) {
  return pixels.map((pixel, i) => (
    <rect
      key={`${pixel.x},${pixel.y}`}
      x={pixel.x}
      y={pixel.y}
      width={1}
      height={1}
      style={{ transitionDelay: `${lampDelay(pixel)}ms` }}
      className={`${className} transition-[fill] duration-500 ${i % 9 === 4 ? 'motion-safe:animate-flicker' : ''}`}
    />
  ));
}

function Car({ isEastbound }: { isEastbound: boolean }) {
  return (
    <g
      className={`motion-reduce:hidden ${isEastbound ? 'animate-drive-east' : 'translate-x-16 animate-drive-west'}`}
    >
      <rect x={isEastbound ? 0 : 1} y={20} width={3} height={1} className="fill-car" />
      <rect
        x={isEastbound ? 3 : 0}
        y={20}
        width={1}
        height={1}
        className="fill-lamp transition-[fill] duration-500"
      />
    </g>
  );
}

export function Skyline() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch between day and night"
      title="Switch between day and night"
      className="block cursor-pointer rounded-sm outline-offset-4 transition-[scale] duration-200 ease-out active:scale-98 motion-reduce:transition-none"
    >
      <svg
        viewBox="0 0 60 22"
        width={180}
        height={66}
        shapeRendering="crispEdges"
        aria-hidden="true"
        className="block"
      >
        {stars.map(([x, y], i) => (
          <rect
            key={`${x},${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            style={{
              animationDelay: `${(i * 0.37) % 3}s`,
              animationDuration: `${2.6 + ((i * 0.53) % 2.5)}s`,
            }}
            className="fill-star opacity-60 transition-[fill] delay-600 duration-800 motion-safe:animate-twinkle"
          />
        ))}
        <g className="translate-x-[45px] translate-y-[calc(2px+var(--night)*20px)] fill-sun transition-[translate,fill] duration-1100 ease-in-out motion-reduce:transition-none">
          <Rects runs={shapes.disc} />
        </g>
        <g className="translate-x-[11px] translate-y-[calc(22px-var(--night)*20px)] fill-moon transition-[translate,fill] duration-1100 ease-in-out motion-reduce:transition-none">
          <Rects runs={shapes.disc} />
          {craters.map(([x, y]) => (
            <rect key={`${x},${y}`} x={x} y={y} width={1} height={1} className="fill-crater" />
          ))}
        </g>
        <Rects runs={shapes.far} className="fill-far" />
        <Lamps pixels={shapes.farLamps} className="fill-lamp-far" />
        <Rects runs={shapes.near} className="fill-near" />
        <Rects runs={shapes.windows} className="fill-window" />
        <Lamps pixels={shapes.lamps} className="fill-lamp" />
        <Rects runs={shapes.street} className="fill-street" />
        <Car isEastbound />
        <Car isEastbound={false} />
      </svg>
    </button>
  );
}
