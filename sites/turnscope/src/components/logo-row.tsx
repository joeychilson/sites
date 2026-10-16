import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import Logo, { type LogoName } from './logo';

type Named = { name: string; logo: LogoName; plan?: string };

type LogoRowProps = {
  title: string;
  names: ReadonlyArray<Named>;
};

/** A label, then names with their logos, in a row that wraps. */
export default function LogoRow({ title, names }: LogoRowProps) {
  return (
    <div {...stylex.props(styles.row)}>
      <h2 {...stylex.props(styles.title)}>{title}</h2>
      <ul {...stylex.props(styles.names)}>
        {names.map((named) => (
          <li key={named.name} {...stylex.props(styles.name)}>
            <Logo name={named.logo} width={18} height={18} {...stylex.props(styles.logo)} />
            {named.name}
            {named.plan && <span {...stylex.props(styles.plan)}>{named.plan}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = stylex.create({
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 28,
    rowGap: 12,
  },
  title: {
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 400,
    letterSpacing: 'normal',
    color: colorVars['--color-text-disabled'],
  },
  names: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 28,
    rowGap: 12,
  },
  name: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
    lineHeight: 1.5,
    color: colorVars['--color-text-secondary'],
    whiteSpace: 'nowrap',
  },
  logo: {
    flexShrink: 0,
    color: colorVars['--color-text-primary'],
  },
  plan: {
    color: colorVars['--color-text-disabled'],
  },
});
