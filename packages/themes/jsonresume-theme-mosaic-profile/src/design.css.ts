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
  font: {
    body: 'Figtree, Arial, sans-serif',
    display: 'Bricolage Grotesque, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '45px', heading: '19px' },
  space: { section: '34px', entry: '23px', gutter: '48px' },
  width: '1100px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 45px)',
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
  background: `${tokens.color.soft}`,
  color: `${tokens.color.accent}`,
  padding: '8px 11px',
  borderRadius: '0 12px 12px 0',
});
globalStyle(`.${design}[data-theme] .${c.secondary}`, {
  paddingInlineStart: '20px',
  borderInlineStart: `1px solid ${tokens.color.rule}`,
  '@media': {
    'screen and (max-width: 640px)': { paddingInlineStart: 0, border: 0 },
  },
});
globalStyle(
  `.${design}[data-theme] .${c.section}:nth-child(3n+2) .${c.sectionTitle}`,
  { borderInlineStart: '3px solid #a92335' }
);
globalStyle(
  `.${design}[data-theme] .${c.section}:nth-child(3n) .${c.sectionTitle}`,
  { borderInlineStart: '3px solid #215c47' }
);
globalStyle(
  `.${design}[data-theme][data-monochrome="true"] .${c.masthead}::before`,
  { boxShadow: 'none' }
);
globalStyle(
  `.${design}[data-theme][data-monochrome="true"] .${c.section} .${c.sectionTitle}`,
  { borderColor: 'currentColor' }
);
