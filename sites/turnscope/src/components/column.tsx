import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { media } from '../styles/tokens.stylex';

type ColumnProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/** The page's column: up to 1180px wide, with room at the edges. */
export default function Column<T extends ElementType = 'div'>({ as, ...props }: ColumnProps<T>) {
  const Element: ElementType = as ?? 'div';
  return <Element {...props} {...stylex.props(styles.column)} />;
}

const styles = stylex.create({
  column: {
    width: '100%',
    maxWidth: 1180,
    marginInline: 'auto',
    paddingInline: { default: 20, [media.wide]: 32 },
  },
});
