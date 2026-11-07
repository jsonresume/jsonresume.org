import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#864c42',
    soft: '#faf1ed',
    sidebar: '#653b34',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: { body: 'Inter, Arial, sans-serif', display: 'Inter, Georgia, serif' },
  type: { size: '16px', leading: '1.65', name: '31px', heading: '19px' },
  space: { section: '40px', entry: '25px', gutter: '44px' },
  width: '840px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 31px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
