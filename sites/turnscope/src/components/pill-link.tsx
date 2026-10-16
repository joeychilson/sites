import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

type PillLinkProps = {
  href: string;
  size: keyof typeof sizes;
  children: string;
};

/** A link drawn as the page's one kind of button. */
export default function PillLink({ href, size, children }: PillLinkProps) {
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
    scale: { default: 1, ':active': 0.97 },
    transitionProperty: 'background-color, scale',
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
