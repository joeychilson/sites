import type { ThemeRegistration } from 'shiki';

/**
 * Code in the city's colors: the page's grays for most of it, the lamps'
 * amber for keywords, the sun's orange for numbers and the moon's blue for
 * strings. By day they're deepened to read on white.
 */
type Palette = {
  text: string;
  quiet: string;
  comment: string;
  keyword: string;
  string: string;
  number: string;
  type: string;
  name: string;
};

function theme(name: string, type: 'light' | 'dark', c: Palette): ThemeRegistration {
  return {
    name,
    type,
    colors: { 'editor.foreground': c.text },
    tokenColors: [
      { settings: { foreground: c.text } },
      {
        scope: ['comment', 'punctuation.definition.comment'],
        settings: { foreground: c.comment, fontStyle: 'italic' },
      },
      {
        scope: ['keyword', 'storage', 'storage.type', 'storage.modifier'],
        settings: { foreground: c.keyword },
      },
      {
        scope: [
          'keyword.operator',
          'punctuation',
          'meta.brace',
          'punctuation.separator',
          'punctuation.terminator',
          'punctuation.accessor',
        ],
        settings: { foreground: c.quiet },
      },
      {
        scope: ['string', 'punctuation.definition.string', 'string.template', 'string.regexp'],
        settings: { foreground: c.string },
      },
      {
        scope: [
          'constant.numeric',
          'constant.language',
          'constant.character',
          'constant.other',
          'variable.language',
        ],
        settings: { foreground: c.number },
      },
      {
        scope: [
          'entity.name.type',
          'entity.name.class',
          'entity.name.namespace',
          'support.type',
          'support.class',
          'entity.other.inherited-class',
        ],
        settings: { foreground: c.type },
      },
      {
        scope: ['entity.name.function', 'support.function', 'entity.name.function.macro'],
        settings: { foreground: c.name },
      },
      {
        scope: ['entity.name.tag', 'punctuation.definition.tag'],
        settings: { foreground: c.keyword },
      },
      { scope: ['entity.other.attribute-name'], settings: { foreground: c.type } },
      {
        scope: ['support.type.property-name', 'meta.object-literal.key'],
        settings: { foreground: c.text },
      },
      { scope: ['markup.inserted'], settings: { foreground: c.string } },
      { scope: ['markup.deleted'], settings: { foreground: c.number } },
      {
        scope: ['markup.heading', 'markup.bold'],
        settings: { foreground: c.name, fontStyle: 'bold' },
      },
    ],
  };
}

export const day = theme('city-day', 'light', {
  text: '#262626',
  quiet: '#8c8c8c',
  comment: '#999999',
  keyword: '#a15c05',
  string: '#3c6591',
  number: '#bd4a1c',
  type: '#56627a',
  name: '#000000',
});

export const night = theme('city-night', 'dark', {
  text: '#dedede',
  quiet: '#888888',
  comment: '#6f6f6f',
  keyword: '#f4c36a',
  string: '#a9b8cf',
  number: '#f39a6b',
  type: '#c6ccd8',
  name: '#ffffff',
});
