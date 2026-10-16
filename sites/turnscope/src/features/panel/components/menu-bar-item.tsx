import * as stylex from '@stylexjs/stylex';

import Logo, { type LogoName } from '../../../components/logo';
import { type Standing, standingInk } from '../../../styles/standing';

type MenuBarItemProps = {
  logo: LogoName;
  figure: string;
  standing: Standing;
};

/**
 * The app's menu bar item (macos/Turnscope/MenuBarItem.swift): the account's mark at 21 points,
 * which leaves room around it, and its figure in the menu bar's own size. The figure is plain while
 * the limit lasts, amber while it runs out and red once it's used up.
 */
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
