import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#383838',
    soft: '#f5f5f3',
    sidebar: '#303030',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Source Sans 3, Arial, sans-serif',
    display: 'DM Serif Display, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '45px', heading: '19px' },
  space: { section: '36px', entry: '25px', gutter: '44px' },
  width: '1080px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 45px)',
  fontWeight: 400,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
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
globalStyle(`.${design}[data-theme] .${c.secondary}`, {
  paddingInlineStart: '20px',
  borderInlineStart: `1px solid ${tokens.color.rule}`,
  '@media': {
    'screen and (max-width: 640px)': { paddingInlineStart: 0, border: 0 },
  },
});
