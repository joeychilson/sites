import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import { MarkdownDocument, type MarkdownDocumentProps } from '@comark/react';
import * as stylex from '@stylexjs/stylex';
import type { Node as MarkdownNode } from 'comark';
import { type ComponentProps, createContext, type CSSProperties, type ReactNode, use } from 'react';

import { text } from '../styles/text';
import CodeBlock from './code-block';

type ProseProps = {
  nodes: Array<MarkdownNode>;
  /** Replaces how an element is drawn, by its tag. */
  components?: MarkdownDocumentProps['components'];
};

type ChildrenProps = { children?: ReactNode };

// Blocks inside a list item are spaced like the items around them, not like paragraphs.
const InListItem = createContext(false);

const useBlockSpacing = () => (use(InListItem) ? styles.listBlock : styles.block);

/** A post's Markdown, parsed by the server, with each element drawn in the site's style. */
export default function Prose({ nodes, components }: ProseProps) {
  return (
    <MarkdownDocument
      value={{ nodes }}
      components={{ ...elements, ...components }}
      className={stylex.props(styles.prose).className}
    />
  );
}

function Paragraph({ children }: ChildrenProps) {
  return <p {...stylex.props(useBlockSpacing(), styles.paragraph)}>{children}</p>;
}

function Link({ id, href, title, children }: ComponentProps<'a'>) {
  return (
    <a id={id} href={href} title={title} {...stylex.props(text.link)}>
      {children}
    </a>
  );
}

function Strong({ children }: ChildrenProps) {
  return <strong {...stylex.props(styles.strong)}>{children}</strong>;
}

function InlineCode({ children }: ChildrenProps) {
  return <code {...stylex.props(styles.inlineCode)}>{children}</code>;
}

function heading(Tag: 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return function Heading({ id, children }: ComponentProps<typeof Tag>) {
    return (
      <Tag
        id={id}
        {...stylex.props(styles.heading, Tag !== 'h2' && styles.subheading, stylex.defaultMarker())}
      >
        {/* A link to the section for pointers; screen readers already move by heading. */}
        {id && (
          <a href={`#${id}`} aria-hidden="true" tabIndex={-1} {...stylex.props(styles.anchor)}>
            #
          </a>
        )}
        {children}
      </Tag>
    );
  };
}

function UnorderedList({ children }: ChildrenProps) {
  return <ul {...stylex.props(useBlockSpacing(), styles.list, styles.bullets)}>{children}</ul>;
}

function OrderedList({ start, children }: ComponentProps<'ol'>) {
  return (
    <ol start={start} {...stylex.props(useBlockSpacing(), styles.list, styles.numbers)}>
      {children}
    </ol>
  );
}

function ListItem({ id, className, children }: ComponentProps<'li'>) {
  // A task list's items show their checkbox in place of a bullet.
  const isTask = className?.split(' ').includes('task-list-item') ?? false;
  return (
    <li id={id} {...stylex.props(styles.item, isTask && styles.task)}>
      <InListItem value>{children}</InListItem>
    </li>
  );
}

function Checkbox({ checked }: ComponentProps<'input'>) {
  return (
    <input type="checkbox" checked={checked} disabled readOnly {...stylex.props(styles.checkbox)} />
  );
}

function Blockquote({ children }: ChildrenProps) {
  return (
    <blockquote {...stylex.props(useBlockSpacing(), styles.blockquote)}>{children}</blockquote>
  );
}

/** `> [!NOTE]` and its kin: a quiet panel with its kind above. */
function Alert({ as: kind, children }: ChildrenProps & { as: string }) {
  return (
    <div role="note" {...stylex.props(useBlockSpacing(), styles.alert)}>
      <p {...stylex.props(text.pixel, styles.alertKind)}>{kind.toUpperCase()}</p>
      {children}
    </div>
  );
}

function Rule() {
  return <hr {...stylex.props(styles.rule)} />;
}

function Image({ src, alt, title }: ComponentProps<'img'>) {
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      loading="lazy"
      decoding="async"
      {...stylex.props(styles.image)}
    />
  );
}

function Table({ children }: ChildrenProps) {
  return <table {...stylex.props(useBlockSpacing(), styles.table)}>{children}</table>;
}

// A column's alignment comes through as an inline text-align, which the cell keeps.
function HeaderCell({ style, children }: ChildrenProps & { style?: CSSProperties }) {
  return (
    <th style={style} {...stylex.props(styles.cell, styles.headerCell)}>
      {children}
    </th>
  );
}

function Cell({ style, children }: ChildrenProps & { style?: CSSProperties }) {
  return (
    <td style={style} {...stylex.props(styles.cell)}>
      {children}
    </td>
  );
}

// Comark gathers footnotes into the only <section> a post has.
function Footnotes({ children }: ChildrenProps) {
  return (
    <section aria-label="Footnotes" {...stylex.props(styles.footnotes)}>
      {children}
    </section>
  );
}

const elements = {
  p: Paragraph,
  a: Link,
  strong: Strong,
  code: InlineCode,
  pre: CodeBlock,
  h2: heading('h2'),
  h3: heading('h3'),
  h4: heading('h4'),
  h5: heading('h5'),
  h6: heading('h6'),
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  // A task list's checkboxes are the only inputs a post has.
  input: Checkbox,
  blockquote: Blockquote,
  note: Alert,
  tip: Alert,
  important: Alert,
  warning: Alert,
  caution: Alert,
  hr: Rule,
  img: Image,
  table: Table,
  th: HeaderCell,
  td: Cell,
  section: Footnotes,
};

const styles = stylex.create({
  prose: {
    overflowWrap: 'break-word',
  },
  block: {
    marginTop: 0,
    marginBottom: { default: 16, ':last-child': 0 },
  },
  listBlock: {
    marginTop: 0,
    marginBottom: { default: 6, ':last-child': 0 },
  },
  // The reset gives paragraphs Astryx's body type; a post's keep the page's.
  paragraph: {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit',
  },
  strong: {
    fontWeight: 600,
  },
  inlineCode: {
    paddingBlock: 1,
    paddingInline: 4,
    borderRadius: 4,
    backgroundColor: colorVars['--color-background-muted'],
    fontSize: '0.87em',
  },
  heading: {
    marginTop: { default: 36, ':first-child': 0 },
    marginBottom: 12,
    fontSize: 'inherit',
    fontWeight: 560,
    lineHeight: 'inherit',
    scrollMarginTop: 24,
  },
  subheading: {
    color: colorVars['--color-text-secondary'],
  },
  anchor: {
    float: 'left',
    marginLeft: '-0.9em',
    color: colorVars['--color-text-disabled'],
    opacity: { default: 0, [stylex.when.ancestor(':hover')]: 1 },
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
  },
  list: {
    paddingLeft: '1.2em',
  },
  bullets: {
    listStyleType: 'disc',
  },
  numbers: {
    listStyleType: 'decimal',
  },
  item: {
    marginTop: { default: 0, ':not(:first-child)': 6 },
    scrollMarginTop: 24,
    '::marker': {
      color: colorVars['--color-text-disabled'],
    },
  },
  task: {
    listStyleType: 'none',
  },
  checkbox: {
    marginInlineStart: '-1.2em',
    marginInlineEnd: 6,
    verticalAlign: 'middle',
  },
  blockquote: {
    paddingLeft: '1.2em',
    color: colorVars['--color-text-secondary'],
  },
  alert: {
    paddingBlock: 12,
    paddingInline: 16,
    borderRadius: 10,
    backgroundColor: colorVars['--color-background-muted'],
  },
  alertKind: {
    marginBottom: 8,
  },
  rule: {
    height: 'auto',
    marginBlock: 32,
    borderStyle: 'none',
    textAlign: 'center',
    '::after': {
      content: '"* * *"',
      color: colorVars['--color-text-disabled'],
      letterSpacing: '0.5em',
    },
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: 6,
  },
  table: {
    display: 'block',
    overflowX: 'auto',
  },
  cell: {
    paddingBlock: 4,
    paddingInlineStart: 0,
    paddingInlineEnd: 24,
  },
  headerCell: {
    color: colorVars['--color-text-disabled'],
    fontWeight: 'inherit',
    textAlign: 'left',
  },
  footnotes: {
    marginTop: 32,
    color: colorVars['--color-text-secondary'],
  },
});
