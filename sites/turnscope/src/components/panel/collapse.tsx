import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import { media, motion, tokens } from '../../styles/tokens.stylex';
import { appears } from './styles';

type CollapseProps = {
  isOpen: boolean;
  children: ReactNode;
};

/** Opens to its content's height on the app's spring. Spans throughout, so it fits inside a button. */
export default function Collapse({ isOpen, children }: CollapseProps) {
  return (
    <span {...stylex.props(styles.space, isOpen && styles.open)}>
      <span {...stylex.props(styles.clip, isOpen ? appears.shown : appears.hidden)}>
        {children}
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
});
