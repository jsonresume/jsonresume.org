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
    body: 'Nunito Sans, Arial, sans-serif',
    display: 'Nunito Sans, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '43px', heading: '19px' },
  space: { section: '35px', entry: '23px', gutter: '40px' },
  width: '970px',
});
globalStyle(`.${design}[data-theme] .${c.name}`, {
  fontSize: 'clamp(30px, 5vw, 43px)',
  fontWeight: 700,
});
globalStyle(`.${design}[data-theme] .${c.masthead}`, { paddingBottom: '24px' });
globalStyle(`.${design}[data-theme] .${c.body}`, { gap: '28px' });
globalStyle(`.${design}[data-theme] .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  marginBottom: '14px',
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
