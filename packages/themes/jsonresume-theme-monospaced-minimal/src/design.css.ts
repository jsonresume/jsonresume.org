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
    body: 'Public Sans, Arial, sans-serif',
    display: 'IBM Plex Mono, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '34px', heading: '19px' },
  space: { section: '31px', entry: '23px', gutter: '44px' },
  width: '950px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 34px)',
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
  paddingBottom: '7px',
  borderBottom: `1px dotted ${tokens.color.accent}`,
});
globalStyle(`.${design}[data-theme] .${c.date}`, {
  fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
});
globalStyle(`.${design}[data-theme] .${c.contact}`, {
  fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
});
globalStyle(`.${design}[data-theme] .${c.details}`, {
  fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
});
