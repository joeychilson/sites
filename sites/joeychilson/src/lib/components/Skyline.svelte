<script lang="ts" module>
  // A pixel city, 60 × 22 pixels. Each building is [x, width, height],
  // standing on the street at row 21. The tallest stand 14 high, leaving the
  // top rows to the sky.
  const WIDTH = 60;
  const HEIGHT = 22;
  const STREET = 21;
  
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

  // The same "random" every time, so the city is built the same way twice.
  function random(seed: number) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const next = random(27);

  type Window = {
    x: number;
    y: number;
    lit: boolean;
    far: boolean;
    delay: number;
    flicker: boolean;
  };

  // Windows every other pixel on the near buildings, and a few far ones.
  // Those lit at night come on one by one as night falls.
  const windows: Window[] = [
    ...front.flatMap(([x, w, h]) => {
      const cells = [];
      for (let wx = x + 1; wx < x + w - 1; wx += 2)
        for (let wy = STREET - h + 2; wy < STREET - 1; wy += 2)
          cells.push({ x: wx, y: wy, lit: next() < 0.45, far: false });
      return cells;
    }),
    ...back.flatMap(([x, w, h]) => {
      const cells = [];
      for (let wx = x + 1; wx < x + w - 1; wx += 2)
        for (let wy = STREET - h + 2; wy < STREET - 1; wy += 3)
          if (next() < 0.22) cells.push({ x: wx, y: wy, lit: true, far: true });
      return cells;
    }),
  ].map((cell) => ({ ...cell, delay: Math.round(300 + next() * 1300), flicker: next() < 0.08 }));

  const roof = (x: number) =>
    Math.min(
      STREET,
      ...back.concat(front).flatMap(([bx, w, h]) => (x >= bx && x < bx + w ? [STREET - h] : [])),
    );

  const stars = Array.from({ length: 16 }, () => ({
    x: Math.floor(next() * WIDTH),
    y: Math.floor(next() * 7),
    delay: next() * 4,
    duration: 2.5 + next() * 3,
  }))
    .filter((star) => star.y < roof(star.x) - 2)
    // No two touching, or they read as a dash.
    .filter((star, i, all) =>
      all
        .slice(0, i)
        .every((other) => Math.max(Math.abs(other.x - star.x), Math.abs(other.y - star.y)) > 1),
    );

  // The sun and a full moon, five pixels across, drawn around their centers;
  // `o` marks a crater.
  const pixels = (rows: string[]) =>
    rows.flatMap((row, y) =>
      [...row].flatMap((c, x) => (c === '.' ? [] : [{ x: x - 2, y: y - 2, shade: c === 'o' }])),
    );
  const bodies = [
    { name: 'sun', x: 47, y: 4, pixels: pixels(['.###.', '#####', '#####', '#####', '.###.']) },
    { name: 'moon', x: 13, y: 4, pixels: pixels(['.###.', '#o###', '####o', '##o##', '.###.']) },
  ];
</script>

<script lang="ts">
  import type { Theme } from '#lib/theme.svelte.js';

  let { theme }: { theme: Theme } = $props();

  const label = $derived(theme.dark ? 'Switch to day' : 'Switch to night');
</script>

<!-- Three screen pixels to each of the city's, as for the name beneath it. -->
<button type="button" class="skyline" aria-label={label} title={label} onclick={() => theme.toggle()}>
  <svg
    viewBox="0 0 {WIDTH} {HEIGHT}"
    width={WIDTH * 3}
    height={HEIGHT * 3}
    shape-rendering="crispEdges"
    aria-hidden="true"
  >
    <g class="stars">
      {#each stars as star (`${star.x},${star.y}`)}
        <rect
          x={star.x}
          y={star.y}
          width="1"
          height="1"
          style:animation-delay="{star.delay}s"
          style:animation-duration="{star.duration}s"
        />
      {/each}
    </g>

    {#each bodies as body (body.name)}
      <g class={body.name}>
        <g transform="translate({body.x} {body.y})">
          {#each body.pixels as pixel (`${pixel.x},${pixel.y}`)}
            <rect x={pixel.x} y={pixel.y} width="1" height="1" class={[pixel.shade && 'crater']} />
          {/each}
        </g>
      </g>
    {/each}

    <g class="back">
      {#each back as [x, w, h] (x)}
        <rect {x} y={STREET - h} width={w} height={h} />
      {/each}
      <rect x="36" y={STREET - 16} width="1" height="2" />
    </g>

    {@render lights(windows.filter((cell) => cell.far))}

    <g class="front">
      {#each front as [x, w, h] (x)}
        <rect {x} y={STREET - h} width={w} height={h} />
      {/each}
      <rect x="38" y={STREET - 12} width="4" height="1" />
      <rect x="39" y={STREET - 13} width="2" height="1" />
    </g>

    {@render lights(windows.filter((cell) => !cell.far))}

    <rect class="street" x="0" y={STREET} width={WIDTH} height="1" />

    <g class="car">
      <rect x="0" y={STREET - 1} width="3" height="1" />
      <rect class="lamp" x="3" y={STREET - 1} width="1" height="1" />
    </g>
    <g class="car car-back">
      <rect x="1" y={STREET - 1} width="3" height="1" />
      <rect class="lamp" x="0" y={STREET - 1} width="1" height="1" />
    </g>
  </svg>
</button>

<!--
  A window is a pane that turns with the page at once, and, if it's one lit
  at night, a lamp over it that comes on in its own time.
-->
{#snippet lights(cells: Window[])}
  <g class="windows">
    {#each cells as cell (`${cell.x},${cell.y}`)}
      {#if !cell.far}
        <rect class="pane" x={cell.x} y={cell.y} width="1" height="1" />
      {/if}
      {#if cell.lit}
        <rect
          class={['lamp', cell.far && 'far', cell.flicker && 'flicker']}
          x={cell.x}
          y={cell.y}
          width="1"
          height="1"
          style:transition-delay="{cell.delay}ms"
        />
      {/if}
    {/each}
  </g>
{/snippet}

<style>
  /*
   * Day and night follow the page's colors, so the city is right before any
   * script runs: a color given as light-dark() is the day's, then the
   * night's. Only where the sun and moon stand needs rules of its own.
   */
  .skyline {
    --building-back: color-mix(in oklab, var(--color-ink) 7%, var(--color-page));
    --building-front: color-mix(in oklab, var(--color-ink) 15%, var(--color-page));
    --window: color-mix(in oklab, var(--color-ink) 5%, var(--color-page));
    --lamp: #f4c36a;
    display: block;
    border-radius: 4px;
    cursor: pointer;
    transition: scale 200ms var(--ease-out);

    &:active {
      scale: 0.98;
    }
  }

  svg {
    display: block;
    overflow: hidden;
  }

  .back rect {
    fill: var(--building-back);
  }

  .front rect {
    fill: var(--building-front);
  }

  .street {
    fill: color-mix(in oklab, var(--color-ink) 11%, var(--color-page));
  }

  .pane {
    fill: var(--window);
  }

  .lamp {
    fill: light-dark(transparent, var(--lamp));
    transition: fill 500ms;
  }

  .lamp.far {
    fill: light-dark(transparent, color-mix(in oklab, var(--lamp) 55%, transparent));
  }

  .lamp.flicker {
    animation: flicker 7s steps(1) infinite;
  }

  .stars rect {
    fill: light-dark(transparent, var(--color-ink-3));
    opacity: 0.6;
    transition: fill 800ms 600ms;
    animation: twinkle 3s ease-in-out infinite alternate;
  }

  .sun rect {
    fill: light-dark(#f2a93b, transparent);
  }

  .moon rect {
    fill: light-dark(transparent, #d4d9e4);
  }

  .moon .crater {
    fill: light-dark(transparent, #aab2c2);
  }

  .sun rect,
  .moon rect {
    transition: fill 900ms;
  }

  /* The sun sets behind the city as the moon rises, and back. */
  .sun,
  .moon {
    transition: translate 1100ms cubic-bezier(0.65, 0, 0.35, 1);
  }

  .moon {
    translate: 0 20px;
  }

  :global(:root[data-theme='dark']) .sun {
    translate: 0 20px;
  }

  :global(:root[data-theme='dark']) .moon {
    translate: 0 0;
  }

  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .sun {
      translate: 0 20px;
    }

    :global(:root:not([data-theme='light'])) .moon {
      translate: 0 0;
    }
  }

  .car rect:not(.lamp) {
    fill: color-mix(in oklab, var(--color-ink) 40%, var(--color-page));
  }

  .car {
    animation: drive 11s linear infinite;
  }

  .car-back {
    animation: drive-back 16s linear 5s infinite both;
  }

  @keyframes twinkle {
    from {
      opacity: 0.2;
    }
    to {
      opacity: 0.9;
    }
  }

  @keyframes flicker {
    0%,
    60%,
    64%,
    100% {
      opacity: 1;
    }
    62% {
      opacity: 0.2;
    }
  }

  @keyframes drive {
    from {
      transform: translateX(-5px);
    }
    to {
      transform: translateX(64px);
    }
  }

  @keyframes drive-back {
    from {
      transform: translateX(64px);
    }
    to {
      transform: translateX(-5px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .car {
      display: none;
    }
  }
</style>
