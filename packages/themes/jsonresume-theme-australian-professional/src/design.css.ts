import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#33604a',
    soft: '#f0f5ef',
    sidebar: '#294b39',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: { body: 'Lato, Arial, sans-serif', display: 'Lato, Georgia, serif' },
  type: { size: '16px', leading: '1.65', name: '42px', heading: '19px' },
  space: { section: '36px', entry: '24px', gutter: '52px' },
  width: '1050px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 42px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '40px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  paddingTop: '10px',
  backgroundImage: `linear-gradient(${tokens.color.accent},${tokens.color.accent})`,
  backgroundSize: '38px 2px',
  backgroundPosition: 'left top',
  backgroundRepeat: 'no-repeat',
});
globalStyle(`.${design}[data-theme] .${c.secondary}`, {
  background: `${tokens.color.soft}`,
  padding: '20px',
  '@media': { 'screen and (max-width: 640px)': { padding: '20px' } },
});
