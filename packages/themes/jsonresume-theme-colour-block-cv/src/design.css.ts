import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#4f488b',
    soft: '#f2f0fa',
    sidebar: '#f2f0fa',
    sidebarInk: '#20262e',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Lato, Arial, sans-serif',
    display: 'League Spartan, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '43px', heading: '19px' },
  space: { section: '33px', entry: '25px', gutter: '40px' },
  width: '1100px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 43px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '37px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  background: `${tokens.color.accent}`,
  color: '#fff',
  padding: '28px',
});
globalStyle(`.${design}[data-theme] .${c.label}`, { color: 'inherit' });
globalStyle(`.${design}[data-theme] .${c.contact}`, { color: 'inherit' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  background: `${tokens.color.soft}`,
  color: `${tokens.color.accent}`,
  padding: '8px 11px',
  borderRadius: 0,
});
globalStyle(`.${design}[data-theme] .${c.secondary} .${c.sectionTitle}`, {
  background: 'transparent',
  borderColor: 'currentColor',
  color: 'inherit',
  paddingInlineStart: 0,
});
