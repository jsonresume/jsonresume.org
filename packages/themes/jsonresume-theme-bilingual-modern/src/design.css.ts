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
    display: 'Plus Jakarta Sans, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '38px', heading: '19px' },
  space: { section: '33px', entry: '25px', gutter: '40px' },
  width: '970px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 38px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '37px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(180px, .55fr)',
  gap: '18px 28px',
  borderBottom: `1px solid ${tokens.color.rule}`,
  '@media': { 'screen and (max-width: 640px)': { display: 'block' } },
});
globalStyle(`.${design}[data-theme] .${c.contact}`, {
  marginTop: 0,
  display: 'grid',
  alignContent: 'start',
  '@media': { 'screen and (max-width: 640px)': { marginTop: '18px' } },
});
globalStyle(`.${design}[data-theme] .${c.summary}`, {
  gridColumn: '1 / -1',
  marginTop: 0,
  '@media': { 'screen and (max-width: 640px)': { marginTop: '22px' } },
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  paddingTop: '10px',
  backgroundImage: `linear-gradient(${tokens.color.accent},${tokens.color.accent})`,
  backgroundSize: '38px 2px',
  backgroundPosition: 'left top',
  backgroundRepeat: 'no-repeat',
});
