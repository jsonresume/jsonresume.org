import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#75512e',
    soft: '#f6f2e9',
    sidebar: '#5c452f',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'DM Sans, Arial, sans-serif',
    display: 'DM Serif Display, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '39px', heading: '19px' },
  space: { section: '35px', entry: '24px', gutter: '48px' },
  width: '960px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 39px)',
  fontWeight: 400,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.identity}`, {
  border: `1px solid ${tokens.color.accent}`,
  padding: '18px',
  maxWidth: '100%',
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
