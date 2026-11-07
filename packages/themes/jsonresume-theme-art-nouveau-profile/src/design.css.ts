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
  font: {
    body: 'Work Sans, Arial, sans-serif',
    display: 'DM Serif Display, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '52px', heading: '19px' },
  space: { section: '39px', entry: '23px', gutter: '48px' },
  width: '940px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 52px)',
  fontWeight: 400,
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
globalStyle(`.${design}[data-theme] .${c.context}`, { fontStyle: 'italic' });
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  borderBottom: `2px solid ${tokens.color.accent}`,
  borderEndEndRadius: '38px',
});
