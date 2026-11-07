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
    body: 'Inter, Arial, sans-serif',
    display: 'Archivo Black, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '76px', heading: '19px' },
  space: { section: '36px', entry: '23px', gutter: '40px' },
  width: '1020px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 76px)',
  fontWeight: 400,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  '@media': { print: { fontSize: '40pt' } },
});
