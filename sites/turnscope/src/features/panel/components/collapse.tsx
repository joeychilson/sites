import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import { media, motion, tokens } from '../../../styles/tokens.stylex';
import { appears } from '../styles/appears';

type CollapseProps = {
  isOpen: boolean;
  children: ReactNode;
};

/**
 * Content that opens its space on the app's spring and closes it the same way. Spans throughout, so
 * it can sit inside a row's button.
 */
export default function Collapse({ isOpen, children }: CollapseProps) {
  return (
    <span {...stylex.props(styles.space, isOpen && styles.open)}>
      <span {...stylex.props(styles.clip)}>
        <span {...stylex.props(styles.content, isOpen ? appears.shown : appears.hidden)}>
          {children}
        </span>
      </span>
    </span>
  );
}

const styles = stylex.create({
  // A grid row between 0fr and 1fr animates to the content's own height.
  space: {
    display: 'grid',
    gridTemplateRows: '0fr',
    transitionProperty: 'grid-template-rows',
    transitionDuration: { default: motion.spring, [media.reducedMotion]: '0s' },
    transitionTimingFunction: tokens.easeSpring,
  },
  open: {
    gridTemplateRows: '1fr',
  },
  clip: {
    display: 'block',
    minHeight: 0,
    overflow: 'hidden',
  },
  content: {
    display: 'block',
  },
});
