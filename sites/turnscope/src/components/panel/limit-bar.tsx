import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import type { Standing } from '../../demo';
import { media, motion, tokens } from '../../styles/tokens.stylex';

type LimitBarProps = {
  /** What's left, from 0 to 100. */
  percent: number;
  standing: Standing;
  /** Grows to its level each time it's shown, as the app's bar does when its row opens. */
  isShown: boolean;
};

// It only draws what the line above it says, so screen readers skip it.
export default function LimitBar({ percent, standing, isShown }: LimitBarProps) {
  return (
    <span aria-hidden="true" {...stylex.props(styles.track)}>
      {percent > 0 && (
        <span
          {...stylex.props(
            styles.fill,
            fills[standing],
            isShown && styles.grows,
            styles.level(`${percent}%`),
          )}
        />
      )}
    </span>
  );
}

const grow = stylex.keyframes({
  from: { width: 0 },
});

const styles = stylex.create({
  track: {
    position: 'relative',
    display: 'block',
    height: 5,
    borderRadius: 999,
    backgroundColor: tokens.labelQuaternary,
  },
  fill: {
    position: 'absolute',
    insetBlock: 0,
    left: 0,
    borderRadius: 999,
  },
  grows: {
    animationName: { default: grow, [media.reducedMotion]: 'none' },
    animationDuration: motion.spring,
    animationTimingFunction: tokens.easeSpring,
    animationDelay: '50ms',
    animationFillMode: 'both',
  },
  // At least as wide as it is tall, so a sliver still reads as a bar.
  level: (percent: string) => ({
    width: `max(5px, ${percent})`,
  }),
});

const fills = stylex.create({
  lasts: { backgroundColor: tokens.labelSecondary },
  short: { backgroundColor: colorVars['--color-warning'] },
  out: { backgroundColor: colorVars['--color-error'] },
});
