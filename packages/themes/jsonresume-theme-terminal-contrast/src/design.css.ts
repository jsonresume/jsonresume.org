import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#33604a',
    soft: '#f0f5ef',
    sidebar: '#294b39',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'IBM Plex Sans, Arial, sans-serif',
    display: 'IBM Plex Mono, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '34px', heading: '19px' },
  space: { section: '29px', entry: '24px', gutter: '48px' },
  width: '1060px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 34px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.date}`, {
  fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
});
globalStyle(`.${design}[data-theme] .${c.contact}`, {
  fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
});
globalStyle(`.${design}[data-theme] .${c.details}`, {
  fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
});
globalStyle(`.${design}[data-theme] .${c.secondary} .${c.sectionTitle}`, {
  background: 'transparent',
  borderColor: 'currentColor',
  color: 'inherit',
  paddingInlineStart: 0,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  '@media': { print: { background: '#fff', color: `${tokens.color.ink}` } },
});
globalStyle(`.${design}[data-theme] .${c.secondary}`, {
  '@media': { print: { background: '#fff', color: `${tokens.color.ink}` } },
});
