import '../src/styles/global.css';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import Footer from '../src/components/footer';
import Header from '../src/components/header';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div {...stylex.props(styles.page)}>
      <Header />
      <main id="main" {...stylex.props(styles.main)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

// At least the window's height, so a short page keeps its footer at the bottom.
const styles = stylex.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
  },
  main: {
    flexGrow: 1,
  },
});
