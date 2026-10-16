import * as stylex from '@stylexjs/stylex';

import type { Standing } from '../../demo';
import Logo, { type LogoName } from '../logo';
import { standingInk } from './styles';

type MenuBarItemProps = {
  logo: LogoName;
  figure: string;
  standing: Standing;
};

/** The app's menu bar item (macos/Turnscope/MenuBarItem.swift): a logo and its figure. */
export default function MenuBarItem({ logo, figure, standing }: MenuBarItemProps) {
  return (
    <span {...stylex.props(styles.item)}>
      <Logo name={logo} width={21} height={21} />
      <span {...stylex.props(styles.figure, standingInk[standing])}>{figure}</span>
    </span>
  );
}

const styles = stylex.create({
  item: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    paddingInline: 1,
    whiteSpace: 'nowrap',
  },
  figure: {
    fontSize: 13,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
});
