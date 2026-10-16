import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import PillLink from '../src/components/pill-link';
import { text } from '../src/styles/text';
import { media } from '../src/styles/tokens.stylex';

export default function NotFound() {
  return (
    <div {...stylex.props(styles.page)}>
      <p {...stylex.props(styles.status)}>404</p>
      <h1 {...stylex.props(text.headline, styles.title)}>There’s no page here</h1>
      <p {...stylex.props(styles.text)}>Check the address, or head back home.</p>
      <div {...stylex.props(styles.action)}>
        <PillLink href="/" size="large">
          Go home
        </PillLink>
      </div>
    </div>
  );
}

const styles = stylex.create({
  page: {
    paddingInline: 24,
    paddingTop: { default: 96, [media.wide]: 144 },
    paddingBottom: 40,
    textAlign: 'center',
  },
  status: {
    fontSize: 15,
    color: colorVars['--color-text-disabled'],
    fontVariantNumeric: 'tabular-nums',
  },
  title: {
    marginTop: 12,
  },
  text: {
    maxWidth: '28em',
    marginTop: 24,
    marginInline: 'auto',
    fontSize: 18,
    lineHeight: 1.5,
    color: colorVars['--color-text-secondary'],
  },
  action: {
    marginTop: 40,
  },
});
