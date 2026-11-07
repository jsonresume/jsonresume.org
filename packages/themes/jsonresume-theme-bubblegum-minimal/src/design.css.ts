import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#78384e',
    soft: '#faf0f3',
    sidebar: '#5a2a3d',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'DM Sans, Arial, sans-serif',
    display: 'Space Mono, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '38px', heading: '19px' },
  space: { section: '38px', entry: '24px', gutter: '52px' },
  width: '940px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 38px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '34px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  background: `${tokens.color.soft}`,
  color: `${tokens.color.accent}`,
  padding: '8px 11px',
  borderRadius: 0,
});
