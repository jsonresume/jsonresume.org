import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#17212a',
    soft: '#eef1f3',
    sidebar: '#17212a',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Inter, Arial, sans-serif',
    display: 'Archivo Black, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '80px', heading: '19px' },
  space: { section: '37px', entry: '24px', gutter: '48px' },
  width: '1020px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 80px)',
  fontWeight: 400,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.identity}`, {
  display: 'flex',
  flexDirection: 'column',
});
globalStyle(`.${design}[data-theme] .${c.label}`, {
  order: -1,
  margin: '0 0 12px',
  fontSize: '15px',
  letterSpacing: '.07em',
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  paddingTop: '10px',
  backgroundImage: `linear-gradient(${tokens.color.accent},${tokens.color.accent})`,
  backgroundSize: '38px 2px',
  backgroundPosition: 'left top',
  backgroundRepeat: 'no-repeat',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  '@media': { print: { fontSize: '40pt' } },
});
