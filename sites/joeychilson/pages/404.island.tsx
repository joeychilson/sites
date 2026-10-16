import * as stylex from '@stylexjs/stylex';

import { text } from '../src/styles/text';

export default function NotFound() {
  return (
    <>
      <h1 {...stylex.props(text.title, styles.title)}>Not found</h1>
      <p {...stylex.props(text.subtitle)}>There’s nothing at this address.</p>
    </>
  );
}

const styles = stylex.create({
  title: {
    marginTop: 64,
  },
});
