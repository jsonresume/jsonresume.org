import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#9b3438',
    soft: '#faf0ed',
    sidebar: '#70272d',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Source Sans 3, Arial, sans-serif',
    display: 'Oswald, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '58px', heading: '19px' },
  space: { section: '34px', entry: '24px', gutter: '52px' },
  width: '1060px',
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
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  borderTop: `5px solid ${tokens.color.accent}`,
  paddingTop: '24px',
});
globalStyle(`.${design}[data-theme]`, { counterReset: 'portfolio-section' });
globalStyle(`.${design}[data-theme] .${c.section}`, {
  counterIncrement: 'portfolio-section',
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}::before`, {
  content: 'counter(portfolio-section, decimal-leading-zero) " / "',
  fontFamily: 'ui-monospace, monospace',
  fontSize: '.72em',
});
