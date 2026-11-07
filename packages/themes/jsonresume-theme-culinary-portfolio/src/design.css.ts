import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#17616a',
    soft: '#edf6f5',
    sidebar: '#164b53',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Public Sans, Arial, sans-serif',
    display: 'Lora, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '39px', heading: '19px' },
  space: { section: '36px', entry: '25px', gutter: '48px' },
  width: '1080px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 39px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '40px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  paddingBottom: '7px',
  borderBottom: `1px solid ${tokens.color.accent}`,
});
globalStyle(`.${design}[data-theme] .${c.secondary} .${c.sectionTitle}`, {
  background: 'transparent',
  borderColor: 'currentColor',
  color: 'inherit',
  paddingInlineStart: 0,
});
