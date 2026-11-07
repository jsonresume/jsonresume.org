import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#9b3027',
    soft: '#fcf1ec',
    sidebar: '#76251f',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Public Sans, Arial, sans-serif',
    display: 'Quicksand, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '43px', heading: '19px' },
  space: { section: '36px', entry: '25px', gutter: '44px' },
  width: '960px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 43px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.identity}`, {
  display: 'flex',
  flexDirection: 'column',
});
globalStyle(`.${design}[data-theme] .${c.label}`, {
  order: -1,
  margin: '0 0 12px',
  fontSize: '15px',
  letterSpacing: '.07em',
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  paddingBottom: '7px',
  borderBottom: `1px dotted ${tokens.color.accent}`,
});
