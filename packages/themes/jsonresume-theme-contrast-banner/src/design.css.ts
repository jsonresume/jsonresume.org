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
  font: { body: 'Inter, Arial, sans-serif', display: 'Anton, Georgia, serif' },
  type: { size: '16px', leading: '1.65', name: '59px', heading: '19px' },
  space: { section: '35px', entry: '23px', gutter: '44px' },
  width: '1020px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 59px)',
  fontWeight: 400,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '40px' });
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
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  paddingBottom: '7px',
  borderBottom: `1px solid ${tokens.color.accent}`,
});
