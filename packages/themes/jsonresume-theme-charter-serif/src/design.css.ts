import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#25282c',
    soft: '#f3f4f5',
    sidebar: '#25282c',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Source Sans 3, Arial, sans-serif',
    display: 'Source Serif 4, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '40px', heading: '19px' },
  space: { section: '30px', entry: '23px', gutter: '40px' },
  width: '930px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 40px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  borderBottom: `4px double ${tokens.color.accent}`,
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  textTransform: 'uppercase',
  letterSpacing: '.09em',
  fontSize: '15px',
});
