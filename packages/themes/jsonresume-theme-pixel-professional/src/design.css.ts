import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#1e4b83',
    soft: '#edf3fa',
    sidebar: '#edf3fa',
    sidebarInk: '#20262e',
    rule: '#c8cfd5',
  },
  font: {
    body: 'DM Sans, Arial, sans-serif',
    display: 'Space Mono, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '34px', heading: '19px' },
  space: { section: '32px', entry: '23px', gutter: '52px' },
  width: '1060px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 34px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '37px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}::before`, {
  content: '""',
  display: 'inline-block',
  width: '7px',
  height: '7px',
  marginInlineEnd: '11px',
  background: `${tokens.color.accent}`,
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
globalStyle(`.${design}[data-theme] .${c.masthead}::before`, {
  content: '""',
  display: 'block',
  width: '9px',
  height: '9px',
  background: `${tokens.color.accent}`,
  borderRadius: 0,
  boxShadow: '17px 0 #a92335, 34px 0 #bc8a29',
  marginBottom: '22px',
});
globalStyle(`.${design}[data-theme] .${c.secondary} .${c.sectionTitle}`, {
  background: 'transparent',
  borderColor: 'currentColor',
  color: 'inherit',
  paddingInlineStart: 0,
});
globalStyle(
  `.${design}[data-theme][data-monochrome="true"] .${c.masthead}::before`,
  { boxShadow: 'none' }
);
globalStyle(
  `.${design}[data-theme][data-monochrome="true"] .${c.section} .${c.sectionTitle}`,
  { borderColor: 'currentColor' }
);
