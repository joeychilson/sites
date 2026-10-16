/**
 * Code in the city's colors: the page's grays for most of it, the lamps' amber for keywords, the
 * sun's orange for numbers and the moon's blue for strings. By day they're deepened to read on white.
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

function codeTheme(name: string, type: 'light' | 'dark', color: Palette) {
  return {
    name,
    type,
    tokenColors: [
      { settings: { foreground: color.text } },
      {
        scope: ['comment', 'punctuation.definition.comment'],
        settings: { foreground: color.comment, fontStyle: 'italic' },
      },
      {
        scope: ['keyword', 'storage'],
        settings: { foreground: color.keyword },
      },
      {
        scope: ['keyword.operator', 'punctuation', 'meta.brace'],
        settings: { foreground: color.quiet },
      },
      {
        scope: ['string', 'punctuation.definition.string'],
        settings: { foreground: color.string },
      },
      {
        scope: [
          'constant.numeric',
          'constant.language',
          'constant.character',
          'constant.other',
          'variable.language',
        ],
        settings: { foreground: color.number },
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
        settings: { foreground: color.type },
      },
      {
        scope: ['entity.name.function', 'support.function'],
        settings: { foreground: color.name },
      },
      {
        scope: ['entity.name.tag', 'punctuation.definition.tag'],
        settings: { foreground: color.keyword },
      },
      { scope: ['entity.other.attribute-name'], settings: { foreground: color.type } },
      {
        scope: ['support.type.property-name', 'meta.object-literal.key'],
        settings: { foreground: color.text },
      },
      { scope: ['markup.inserted'], settings: { foreground: color.string } },
      { scope: ['markup.deleted'], settings: { foreground: color.number } },
      {
        scope: ['markup.heading', 'markup.bold'],
        settings: { foreground: color.name, fontStyle: 'bold' },
      },
    ],
  };
}

export const cityDay = codeTheme('city-day', 'light', {
  text: '#262626',
  quiet: '#8c8c8c',
  comment: '#999999',
  keyword: '#a15c05',
  string: '#3c6591',
  number: '#bd4a1c',
  type: '#56627a',
  name: '#000000',
});

export const cityNight = codeTheme('city-night', 'dark', {
  text: '#dedede',
  quiet: '#888888',
  comment: '#6f6f6f',
  keyword: '#f4c36a',
  string: '#a9b8cf',
  number: '#f39a6b',
  type: '#c6ccd8',
  name: '#ffffff',
});
