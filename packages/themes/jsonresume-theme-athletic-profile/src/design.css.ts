import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#24566c',
    soft: '#edf6f8',
    sidebar: '#edf6f8',
    sidebarInk: '#20262e',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Lato, Arial, sans-serif',
    display: 'League Spartan, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '43px', heading: '19px' },
  space: { section: '32px', entry: '24px', gutter: '44px' },
  width: '1080px',
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
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  paddingBottom: '7px',
  borderBottom: `3px double ${tokens.color.accent}`,
});
globalStyle(`.${design}[data-theme] .${c.secondary} .${c.sectionTitle}`, {
  background: 'transparent',
  borderColor: 'currentColor',
  color: 'inherit',
  paddingInlineStart: 0,
});
