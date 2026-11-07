import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#6d3c74',
    soft: '#f6f0f7',
    sidebar: '#512c56',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Public Sans, Arial, sans-serif',
    display: 'Lora, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '53px', heading: '19px' },
  space: { section: '37px', entry: '24px', gutter: '40px' },
  width: '1100px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 53px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '40px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
});
globalStyle(`.${design}[data-theme] .${c.identity}`, {
  marginInlineStart: '12%',
  paddingInlineStart: '22px',
  borderInlineStart: `7px solid ${tokens.color.accent}`,
  '@media': { 'screen and (max-width: 640px)': { marginInlineStart: 0 } },
});
globalStyle(`.${design}[data-theme] .${c.secondary}`, {
  paddingInlineStart: '20px',
  borderInlineStart: `1px solid ${tokens.color.rule}`,
  '@media': {
    'screen and (max-width: 640px)': { paddingInlineStart: 0, border: 0 },
  },
});
globalStyle(`.${design}[data-theme] .${c.masthead}::before`, {
  content: '""',
  display: 'block',
  width: '9px',
  height: '9px',
  background: `${tokens.color.accent}`,
  borderRadius: '50%',
  boxShadow: '17px 0 #a92335, 34px 0 #bc8a29',
  marginBottom: '22px',
});
globalStyle(
  `.${design}[data-theme][data-monochrome="true"] .${c.masthead}::before`,
  { boxShadow: 'none' }
);
globalStyle(
  `.${design}[data-theme][data-monochrome="true"] .${c.section} .${c.sectionTitle}`,
  { borderColor: 'currentColor' }
);
