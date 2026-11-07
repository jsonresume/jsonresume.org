import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#854326',
    soft: '#faf3ec',
    sidebar: '#65442d',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Literata, Arial, sans-serif',
    display: 'DM Serif Display, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '46px', heading: '19px' },
  space: { section: '36px', entry: '23px', gutter: '40px' },
  width: '920px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 46px)',
  fontWeight: 400,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  border: `1px solid ${tokens.color.accent}`,
  padding: '26px',
  maxWidth: '100%',
});
globalStyle(`.${design}[data-theme] .${c.context}`, { fontStyle: 'italic' });
