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
  font: { body: 'Lato, Arial, sans-serif', display: 'Lato, Georgia, serif' },
  type: { size: '16px', leading: '1.65', name: '42px', heading: '19px' },
  space: { section: '32px', entry: '24px', gutter: '40px' },
  width: '940px',
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
globalStyle(`.${design}[data-theme] .${c.sectionTitle}::before`, {
  content: '""',
  display: 'inline-block',
  width: '7px',
  height: '7px',
  marginInlineEnd: '11px',
  background: `${tokens.color.accent}`,
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  textTransform: 'uppercase',
  letterSpacing: '.09em',
  fontSize: '15px',
});
