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
    body: 'Source Sans 3, Arial, sans-serif',
    display: 'Source Serif 4, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '42px', heading: '19px' },
  space: { section: '32px', entry: '23px', gutter: '52px' },
  width: '950px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 42px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
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
