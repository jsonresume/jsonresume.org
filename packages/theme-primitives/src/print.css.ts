import { globalStyle } from '@vanilla-extract/css';
import { classes as c } from './base.css.js';
import { tokens as t } from './tokens.css.js';

globalStyle('html', { '@media': { print: { background: '#fff' } } });
globalStyle(`.${c.page}[data-theme]`, {
  '@media': {
    print: {
      maxWidth: 'none',
      width: 'auto',
      margin: 0,
      padding: 0,
      fontSize: '10.5pt',
      lineHeight: 1.4,
      printColorAdjust: 'exact',
      vars: {
        [t.space.section]: '6mm',
        [t.space.entry]: '4mm',
        [t.type.heading]: '12pt',
        [t.type.name]: '27pt',
      },
    },
  },
});
globalStyle(`.${c.page}[data-theme] .${c.masthead}`, {
  '@media': { print: { marginBottom: '6mm', breakInside: 'avoid' } },
});
globalStyle(`.${c.page}[data-theme] .${c.contact}`, {
  '@media': { print: { fontSize: '9pt', gap: '1mm 4mm' } },
});
globalStyle(`.${c.page}[data-theme] .${c.label}`, {
  '@media': { print: { fontSize: '12pt' } },
});
globalStyle(`.${c.page}[data-theme] .${c.body}`, {
  '@media': { print: { gap: '7mm' } },
});
globalStyle(`.${c.page} a`, {
  '@media': { print: { textDecoration: 'none' } },
});
globalStyle(`.${c.page}[data-theme] .${c.taxonomyRow}`, {
  '@media': { print: { breakInside: 'avoid' } },
});
globalStyle(`.${c.page}[data-theme] [data-section="references"] article`, {
  '@media': { print: { breakInside: 'avoid' } },
});
globalStyle(`.${c.page}[data-theme] .${c.sectionTitle}`, {
  '@media': {
    print: { fontSize: '12pt', marginBottom: '3mm', paddingBottom: '1.5mm' },
  },
});
globalStyle(`.${c.page}[data-theme][data-layout="left"]`, {
  '@media': {
    print: {
      gridTemplateColumns: 'minmax(48mm, .42fr) minmax(0, 1fr)',
      columnGap: '6mm',
    },
  },
});
globalStyle(`.${c.page}[data-theme][data-layout="left"] .${c.masthead}`, {
  '@media': { print: { padding: '6mm 4mm 4mm', breakInside: 'auto' } },
});
globalStyle(`.${c.page}[data-theme][data-layout="left"] .${c.primary}`, {
  '@media': { print: { padding: '6mm 0' } },
});
globalStyle(`.${c.page}[data-theme][data-layout="left"] .${c.secondary}`, {
  '@media': { print: { padding: '0 4mm 6mm' } },
});
globalStyle(`.${c.page}[data-theme][data-layout="left"] .${c.name}`, {
  '@media': { print: { fontSize: '22pt' } },
});
globalStyle(`.${c.page}[data-theme][data-layout="left"] .${c.contact}`, {
  '@media': { print: { fontSize: '9pt' } },
});
globalStyle(`.${c.page} a:focus-visible`, {
  '@media': { '(forced-colors: active)': { outlineColor: 'LinkText' } },
});
