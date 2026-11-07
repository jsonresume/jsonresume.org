import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#215c47',
    soft: '#edf5f0',
    sidebar: '#194d3c',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Lato, Arial, sans-serif',
    display: 'EB Garamond, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '37px', heading: '19px' },
  space: { section: '33px', entry: '23px', gutter: '44px' },
  width: '920px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 37px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '40px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  borderBottom: `1px solid ${tokens.color.accent}`,
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  borderInlineStart: `3px solid ${tokens.color.accent}`,
  paddingInlineStart: '11px',
});
