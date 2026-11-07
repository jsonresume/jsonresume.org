import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#284c91',
    soft: '#eef2fa',
    sidebar: '#203a70',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Inter, Arial, sans-serif',
    display: 'Space Grotesk, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '35px', heading: '19px' },
  space: { section: '29px', entry: '25px', gutter: '52px' },
  width: '980px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 35px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '31px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  borderBottom: `1px solid ${tokens.color.accent}`,
});
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  borderInlineStart: `1px solid ${tokens.color.accent}`,
  borderInlineEnd: `1px solid ${tokens.color.accent}`,
  padding: '2px 10px',
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
