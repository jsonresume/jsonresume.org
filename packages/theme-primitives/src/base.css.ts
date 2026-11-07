import { globalStyle, style } from '@vanilla-extract/css';
import { tokens as t } from './tokens.css.js';

export const page = style({
  maxWidth: t.width,
  margin: '36px auto',
  padding: t.space.gutter,
  color: t.color.ink,
  background: '#fff',
  fontFamily: t.font.body,
  fontSize: t.type.size,
  lineHeight: t.type.leading,
  overflowWrap: 'anywhere',
  '@media': {
    'screen and (max-width: 640px)': { margin: 0, padding: '28px 22px' },
  },
});
export const masthead = style({ marginBottom: '30px' });
export const identity = style({ minWidth: 0 });
export const name = style({
  margin: 0,
  fontFamily: t.font.display,
  fontSize: t.type.name,
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '-0.025em',
  textWrap: 'balance',
  '@media': { 'screen and (max-width: 640px)': { fontSize: '32px' } },
});
export const label = style({
  margin: '9px 0 0',
  fontSize: '18px',
  color: t.color.accent,
});
export const contact = style({
  listStyle: 'none',
  margin: '15px 0 0',
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px 18px',
  fontSize: '14px',
  color: t.color.muted,
});
export const summary = style({
  margin: '22px 0 0',
  maxWidth: '75ch',
  whiteSpace: 'pre-line',
});
export const portrait = style({
  width: '84px',
  height: '84px',
  objectFit: 'cover',
  float: 'right',
  margin: '0 0 12px 20px',
  borderRadius: '50%',
});
export const body = style({
  display: 'grid',
  gap: '38px',
  alignItems: 'start',
});
export const primary = style({ minWidth: 0 });
export const secondary = style({ minWidth: 0 });
export const section = style({
  marginTop: t.space.section,
  selectors: { '&:first-child': { marginTop: 0 } },
});
export const sectionTitle = style({
  margin: '0 0 13px',
  paddingBottom: '7px',
  borderBottom: `1px solid ${t.color.rule}`,
  fontFamily: t.font.display,
  fontWeight: 700,
  fontSize: t.type.heading,
  lineHeight: 1.3,
  color: t.color.accent,
  breakAfter: 'avoid',
  textWrap: 'balance',
});
export const entry = style({
  marginTop: t.space.entry,
  selectors: { '&:first-child': { marginTop: 0 } },
});
export const entryHead = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '8px 18px',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  breakInside: 'avoid',
  breakAfter: 'avoid',
});
export const entryTitle = style({
  margin: 0,
  fontWeight: 700,
  fontSize: '1em',
  lineHeight: 1.4,
  flex: '1 1 190px',
});
export const date = style({
  margin: 0,
  fontSize: '0.88em',
  color: t.color.muted,
  fontVariantNumeric: 'tabular-nums',
});
export const context = style({
  margin: '3px 0 0',
  color: t.color.muted,
  breakAfter: 'avoid',
});
export const paragraph = style({
  margin: '7px 0 0',
  whiteSpace: 'pre-line',
  orphans: 2,
  widows: 2,
});
export const bullets = style({ margin: '8px 0 0', paddingInlineStart: '19px' });
export const details = style({
  margin: '7px 0 0',
  color: t.color.muted,
  fontSize: '0.93em',
});
export const taxonomy = style({ margin: 0, display: 'grid', gap: '10px' });
export const taxonomyRow = style({ breakInside: 'avoid' });
export const term = style({ fontWeight: 700 });
export const definition = style({ margin: '2px 0 0' });

globalStyle('*, *::before, *::after', { boxSizing: 'border-box' });
globalStyle('html', { background: '#edf0f3', colorScheme: 'light' });
globalStyle('body', { margin: 0, WebkitFontSmoothing: 'antialiased' });
globalStyle(`.${page} a`, {
  color: 'inherit',
  textDecorationThickness: '1px',
  textUnderlineOffset: '3px',
  textDecorationColor: 'currentColor',
});
globalStyle(`.${page} a:focus-visible`, {
  outline: `2px solid ${t.color.accent}`,
  outlineOffset: '3px',
});
globalStyle(`.${bullets} li`, {
  paddingInlineStart: '2px',
  marginTop: '3px',
  orphans: 2,
  widows: 2,
});
globalStyle(`.${page} img`, { maxWidth: '100%' });
globalStyle(`.${page}[data-density="compact"]`, {
  vars: {
    [t.space.section]: '23px',
    [t.space.entry]: '14px',
    [t.type.leading]: '1.45',
  },
});
globalStyle(`.${page}[data-monochrome="true"]`, {
  vars: {
    [t.color.accent]: '#222222',
    [t.color.sidebar]: '#292929',
    [t.color.sidebarInk]: '#ffffff',
  },
});

export const classes = {
  page,
  masthead,
  identity,
  name,
  label,
  contact,
  summary,
  portrait,
  body,
  primary,
  secondary,
  section,
  sectionTitle,
  entry,
  entryHead,
  entryTitle,
  date,
  context,
  paragraph,
  bullets,
  details,
  taxonomy,
  taxonomyRow,
  term,
  definition,
};
