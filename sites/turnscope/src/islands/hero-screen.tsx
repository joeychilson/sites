import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import Terminal from '../components/terminal';
import Turn from '../components/turn';
import MacScreen from '../features/panel/components/mac-screen';

/** The hero's Mac: Claude Code checks its limit in the terminal, under Turnscope's open panel. */
export default function HeroScreen() {
  return (
    <MacScreen
      label="A Mac at 7 AM. Asked to use subagents, Claude Code asks Turnscope whether 2 hours of work fit. About 1 hour 10 minutes of work is left before its 5-hour limit runs out, so it writes the tests itself. Turnscope's panel, open from the menu bar, says Claude Max runs out in 1 hour and is back in 3, and shows each of its limits."
      terminal={
        <Terminal title="app — claude">
          <Turn mark=">" isMuted>
            Use subagents to write the parser's tests.
          </Turn>
          <Turn mark="●">
            <strong>turnscope - check_limits</strong> (MCP)(hours: 2)
          </Turn>
          <Turn mark="⎿" isOutput>
            2 more hours of work don't fit: 5 hours runs out after about 1h 10m of work.
            <br />
            Claude Max (me@example.com): about 1h 10m of work left (40m–2h 10m) before 5 hours runs
            out; it resets 10:00 (in 3h).
            <br />
            <span {...stylex.props(styles.faint)}>… +5 lines (ctrl+o to expand)</span>
          </Turn>
          <Turn mark="●">
            That's about an hour of work, too little for subagents. I'll write the tests myself.
          </Turn>
        </Terminal>
      }
    />
  );
}

const styles = stylex.create({
  faint: {
    color: colorVars['--color-text-disabled'],
  },
});
