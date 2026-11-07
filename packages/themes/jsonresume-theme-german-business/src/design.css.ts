import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#284c91',
    soft: '#eef2fa',
    sidebar: '#203a70',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: { body: 'Lato, Arial, sans-serif', display: 'Lato, Georgia, serif' },
  type: { size: '16px', leading: '1.65', name: '36px', heading: '19px' },
  space: { section: '30px', entry: '25px', gutter: '48px' },
  width: '1000px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 36px)',
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
