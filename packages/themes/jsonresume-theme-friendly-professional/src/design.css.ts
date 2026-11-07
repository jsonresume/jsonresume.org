import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#75512e',
    soft: '#f6f2e9',
    sidebar: '#5c452f',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Public Sans, Arial, sans-serif',
    display: 'DM Sans, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '38px', heading: '19px' },
  space: { section: '34px', entry: '24px', gutter: '52px' },
  width: '930px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 38px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '34px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  background: `${tokens.color.soft}`,
  color: `${tokens.color.ink}`,
  padding: '28px',
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  background: `${tokens.color.soft}`,
  color: `${tokens.color.accent}`,
  padding: '8px 11px',
  borderRadius: '0 12px 12px 0',
});
