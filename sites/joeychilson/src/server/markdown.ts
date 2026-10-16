import { createMarkdownParser, defineComarkPlugin } from 'comark';
import footnotes from 'comark/plugins/footnotes';
import punctuation from 'comark/plugins/punctuation';
import rangi from 'comark/plugins/rangi';
import { textContent, visit } from 'comark/utils';
import type { ShjTheme } from 'rangi';

const syntax = (token: string) => `var(--color-syntax-${token})`;

// Each token takes the city theme's syntax color, so code changes with the page between day and
// night without being highlighted twice.
const cityCode: ShjTheme = {
  name: 'city',
  bg: syntax('background'),
  fg: syntax('variable'),
  tokens: {
    kwd: syntax('keyword'),
    str: syntax('string'),
    esc: syntax('constant'),
    num: syntax('number'),
    bool: syntax('constant'),
    var: syntax('constant'),
    cmnt: syntax('comment'),
    func: syntax('function'),
    section: syntax('function'),
    type: syntax('type'),
    class: syntax('type'),
    oper: syntax('operator'),
    bracket: syntax('punctuation'),
    insert: syntax('added-marker'),
    deleted: syntax('removed-marker'),
    err: syntax('removed-marker'),
  },
};

// Keeps each code block's source on the block, for the button that copies it.
const codeSource = defineComarkPlugin(() => ({
  name: 'code-source',
  post(state) {
    visit(
      state.tree,
      (node) => Array.isArray(node) && node[0] === 'pre',
      (node) => {
        if (Array.isArray(node)) node[1].code = textContent(node);
      },
    );
  },
}));

export const parseMarkdown = createMarkdownParser({
  // Unclosed syntax is what was written; closing it is for text still streaming in.
  autoClose: false,
  plugins: [
    footnotes({ hr: false, label: '' }),
    punctuation(),
    codeSource(),
    rangi({ theme: cityCode }),
  ],
});
