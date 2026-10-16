import * as stylex from '@stylexjs/stylex';
import { type ReactNode, useState } from 'react';

import Glyph from '../../../components/glyph';
import Logo from '../../../components/logo';
import { a11y } from '../../../styles/a11y';
import { media, motion, tokens } from '../../../styles/tokens.stylex';
import { useHeightTransition } from '../../../use-height-transition';
import { accounts, agents } from '../accounts';
import IconButton from './icon-button';
import PillButton from './pill-button';

type SettingsPageProps = {
  /** The accounts hidden from the menu bar and the panel, which the Accounts tab shows and hides. */
  hiddenIds: Array<string>;
  onHide: (id: string, isHidden: boolean) => void;
  onBack: () => void;
};

type SettingGroupProps = {
  title: string;
  children: ReactNode;
};

type SettingRowProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
};

type ChoiceProps<T extends string> = {
  label: string;
  options: ReadonlyArray<T>;
  selected: T;
  onSelect: (option: T) => void;
};

type SwitchProps = {
  label: string;
  isOn: boolean;
  onToggle: () => void;
};

const TABS = ['General', 'Agents', 'Accounts'] as const;

type Tab = (typeof TABS)[number];

const notifications = [
  'A limit will run out',
  'A limit is used up',
  'A limit is back',
  'An account needs signing in',
];

/** Settings, a page the panel slides to: what the menu bar shows, notifications, agents and accounts. */
export default function SettingsPage({ hiddenIds, onHide, onBack }: SettingsPageProps) {
  const [tab, setTab] = useState<Tab>('General');
  // Tabs differ in height; the panel eases to each one's.
  const [content, measureContent] = useHeightTransition<HTMLDivElement>(tab);
  const [menuShows, setMenuShows] = useState('All in use');
  // Each switch flipped from how it started, so changing tabs keeps them.
  const [flipped, setFlipped] = useState<Array<string>>([]);

  const toggle = (label: string, isInitiallyOn: boolean) => (
    <Switch
      label={label}
      isOn={flipped.includes(label) !== isInitiallyOn}
      onToggle={() =>
        setFlipped(
          flipped.includes(label) ? flipped.filter((each) => each !== label) : [...flipped, label],
        )
      }
    />
  );

  return (
    <>
      <div {...stylex.props(styles.header)}>
        <IconButton label="Back" onClick={onBack}>
          <span {...stylex.props(styles.back)}>
            <Glyph name="chevron" />
          </span>
        </IconButton>
        <h3 {...stylex.props(styles.title)}>Settings</h3>
        <Choice
          label="Settings"
          options={TABS}
          selected={tab}
          onSelect={(next) => {
            measureContent();
            setTab(next);
          }}
        />
      </div>
      <div ref={content} {...stylex.props(styles.content)}>
        {tab === 'General' && (
          <>
            <SettingGroup title="Menu bar">
              <SettingRow title="Show">
                <Choice
                  label="Show"
                  options={['All in use', 'Most urgent']}
                  selected={menuShows}
                  onSelect={setMenuShows}
                />
              </SettingRow>
              <SettingRow title="Open at login">{toggle('Open at login', true)}</SettingRow>
            </SettingGroup>
            <SettingGroup title="Notify me when">
              {notifications.map((title) => (
                <SettingRow key={title} title={title}>
                  {toggle(title, true)}
                </SettingRow>
              ))}
            </SettingGroup>
          </>
        )}
        {tab === 'Agents' && (
          <SettingGroup title="Let these agents check their limits">
            {agents.map((agent) => (
              <SettingRow
                key={agent.name}
                title={agent.name}
                icon={<Logo name={agent.logo} width={18} height={18} />}
              >
                {toggle(`Connect ${agent.name}`, agent.isConnected)}
              </SettingRow>
            ))}
          </SettingGroup>
        )}
        {tab === 'Accounts' && (
          <>
            {[
              { title: 'Subscriptions', isApiKey: false },
              { title: 'API keys', isApiKey: true },
            ].map((group) => (
              <SettingGroup key={group.title} title={group.title}>
                {accounts
                  .filter((account) => account.isApiKey === group.isApiKey)
                  .map((account) => (
                    <SettingRow
                      key={account.id}
                      title={account.name}
                      subtitle={account.via}
                      icon={<Logo name={account.logo} width={18} height={18} />}
                    >
                      <Switch
                        label={`Show ${account.name}`}
                        isOn={!hiddenIds.includes(account.id)}
                        onToggle={() => onHide(account.id, !hiddenIds.includes(account.id))}
                      />
                    </SettingRow>
                  ))}
              </SettingGroup>
            ))}
          </>
        )}
      </div>
    </>
  );
}

/** A heading over a card of rows. */
function SettingGroup({ title, children }: SettingGroupProps) {
  return (
    <section>
      <h4 {...stylex.props(styles.groupTitle)}>{title}</h4>
      <div {...stylex.props(styles.card)}>{children}</div>
    </section>
  );
}

/** A setting: its name, and its control on the right. */
function SettingRow({ title, subtitle, icon, children }: SettingRowProps) {
  return (
    <div {...stylex.props(styles.row)}>
      {icon}
      <span {...stylex.props(styles.names)}>
        <span {...stylex.props(styles.name)}>{title}</span>
        {subtitle && <span {...stylex.props(styles.subtitle)}>{subtitle}</span>}
      </span>
      {children}
    </div>
  );
}

/** One of a few options, as pills in a row with the chosen one filled. */
function Choice<T extends string>({ label, options, selected, onSelect }: ChoiceProps<T>) {
  return (
    <fieldset {...stylex.props(styles.choice)}>
      <legend {...stylex.props(a11y.visuallyHidden)}>{label}</legend>
      {options.map((option) => (
        <PillButton key={option} isPressed={option === selected} onClick={() => onSelect(option)}>
          {option}
        </PillButton>
      ))}
    </fieldset>
  );
}

/** The app's switch: the system's accent when on, its knob sliding on the spring. */
function Switch({ label, isOn, onToggle }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      onClick={onToggle}
      {...stylex.props(styles.switch, isOn && styles.switchOn)}
    >
      <span {...stylex.props(styles.knob, isOn && styles.knobOn)} />
    </button>
  );
}

const styles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    paddingInline: 8,
    paddingTop: 8,
    paddingBottom: 10,
  },
  back: {
    display: 'flex',
    scale: '-1 1',
  },
  title: {
    flexGrow: 1,
    fontSize: 15,
    lineHeight: '18px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    paddingInline: 8,
    paddingBottom: 8,
  },
  groupTitle: {
    paddingInline: 12,
    paddingBottom: 4,
    fontSize: 11,
    lineHeight: '14px',
    fontWeight: 600,
    color: tokens.labelSecondary,
  },
  card: {
    paddingBlock: 3,
    borderRadius: 10,
    backgroundColor: tokens.card,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 36,
    paddingBlock: 7,
    paddingInline: 12,
  },
  names: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    flexGrow: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 13,
    lineHeight: '16px',
  },
  subtitle: {
    fontSize: 11,
    lineHeight: '14px',
    color: tokens.labelSecondary,
  },
  choice: {
    display: 'flex',
    gap: 2,
    minWidth: 0,
  },
  switch: {
    position: 'relative',
    flexShrink: 0,
    width: 30,
    height: 18,
    borderRadius: 999,
    backgroundColor: tokens.switchOff,
    cursor: 'default',
    transitionProperty: 'background-color',
    transitionDuration: motion.spring,
    transitionTimingFunction: tokens.easeSpring,
    outlineOffset: 2,
  },
  switchOn: {
    backgroundColor: tokens.controlAccent,
  },
  knob: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: tokens.knob,
    boxShadow: '0 0.5px 1px rgb(0 0 0 / 0.18)',
    transitionProperty: 'translate',
    transitionDuration: { default: motion.spring, [media.reducedMotion]: '0s' },
    transitionTimingFunction: tokens.easeSpring,
  },
  knobOn: {
    translate: '12px 0',
  },
});
