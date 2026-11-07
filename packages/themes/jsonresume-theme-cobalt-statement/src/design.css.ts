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
  font: {
    body: 'Source Sans 3, Arial, sans-serif',
    display: 'Oswald, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '55px', heading: '19px' },
  space: { section: '34px', entry: '25px', gutter: '48px' },
  width: '1100px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 55px)',
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
  background: `${tokens.color.sidebar}`,
  color: '#fff',
  padding: '28px',
});
globalStyle(`.${design}[data-theme] .${c.label}`, { color: 'inherit' });
globalStyle(`.${design}[data-theme] .${c.contact}`, { color: 'inherit' });
globalStyle(`.${design}[data-theme] .${c.secondary}`, {
  background: `${tokens.color.soft}`,
  padding: '20px',
  '@media': { 'screen and (max-width: 640px)': { padding: '20px' } },
});
