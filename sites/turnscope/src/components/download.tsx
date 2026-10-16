import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { site } from '../site';
import PillLink from './pill-link';

export default function Download() {
  return (
    <>
      <div {...stylex.props(styles.button)}>
        <PillLink href="/download" size="large">
          Download for Mac
        </PillLink>
      </div>
      <p {...stylex.props(styles.requires)}>
        Free and open source · {site.requires} · Apple silicon or Intel
      </p>
    </>
  );
}

const styles = stylex.create({
  button: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40,
  },
  requires: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 1.5,
    color: colorVars['--color-text-disabled'],
  },
});
