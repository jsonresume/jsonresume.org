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
    body: 'Figtree, Arial, sans-serif',
    display: 'Cormorant Garamond, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '36px', heading: '19px' },
  space: { section: '40px', entry: '24px', gutter: '44px' },
  width: '1060px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 36px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '37px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.secondary}`, {
  paddingInlineStart: '20px',
  borderInlineStart: `1px solid ${tokens.color.rule}`,
  '@media': {
    'screen and (max-width: 640px)': { paddingInlineStart: 0, border: 0 },
  },
});
