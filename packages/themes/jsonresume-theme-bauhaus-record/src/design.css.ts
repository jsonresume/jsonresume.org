import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#264c78',
    soft: '#f1f4fa',
    sidebar: '#233b58',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: { body: 'Lato, Arial, sans-serif', display: 'Bitter, Georgia, serif' },
  type: { size: '16px', leading: '1.65', name: '56px', heading: '19px' },
  space: { section: '37px', entry: '23px', gutter: '52px' },
  width: '1120px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 56px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '37px' });
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
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  borderInlineStart: `3px solid ${tokens.color.accent}`,
  paddingInlineStart: '11px',
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
  borderRadius: 0,
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
