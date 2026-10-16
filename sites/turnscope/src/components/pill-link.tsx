import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

type PillLinkProps = {
  href: string;
  children: string;
  size: 'small' | 'large';
};

/** The page's pill-shaped call to action, in the near-white "prominent" color. */
export default function PillLink({ href, children, size }: PillLinkProps) {
  return (
    <a href={href} {...stylex.props(styles.pill, sizes[size])}>
      {children}
    </a>
  );
}

const styles = stylex.create({
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: {
      default: colorVars['--color-accent'],
      ':hover': `color-mix(in oklab, ${colorVars['--color-accent']} 84%, ${colorVars['--color-background-body']})`,
    },
    color: colorVars['--color-on-accent'],
    fontWeight: 600,
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
    transitionProperty: 'background-color',
    transitionDuration: '150ms',
  },
});

const sizes = stylex.create({
  small: {
    height: 32,
    paddingInline: 16,
    fontSize: 13,
  },
  large: {
    height: 44,
    paddingInline: 22,
    fontSize: 15,
  },
});
