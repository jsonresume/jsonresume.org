import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#24566c',
    soft: '#edf6f8',
    sidebar: '#173f52',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Inter, Arial, sans-serif',
    display: 'Bricolage Grotesque, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '58px', heading: '19px' },
  space: { section: '37px', entry: '24px', gutter: '52px' },
  width: '1120px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 58px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '34px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.identity}`, {
  marginInlineStart: '12%',
  paddingInlineStart: '22px',
  borderInlineStart: `7px solid ${tokens.color.accent}`,
  '@media': { 'screen and (max-width: 640px)': { marginInlineStart: 0 } },
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
