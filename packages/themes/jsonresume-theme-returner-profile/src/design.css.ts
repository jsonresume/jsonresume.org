import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#17616a',
    soft: '#edf6f5',
    sidebar: '#164b53',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Public Sans, Arial, sans-serif',
    display: 'Public Sans, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '37px', heading: '19px' },
  space: { section: '37px', entry: '25px', gutter: '52px' },
  width: '900px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 37px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '31px' });
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
