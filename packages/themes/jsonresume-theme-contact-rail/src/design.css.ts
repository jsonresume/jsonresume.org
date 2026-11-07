import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ink: '#20262e',
    muted: '#4b5563',
    accent: '#25282c',
    soft: '#f3f4f5',
    sidebar: '#25282c',
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  },
  font: {
    body: 'Source Sans 3, Arial, sans-serif',
    display: 'Source Sans 3, Georgia, serif',
  },
  type: { size: '16px', leading: '1.65', name: '36px', heading: '19px' },
  space: { section: '30px', entry: '23px', gutter: '48px' },
  width: '980px',
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
globalStyle(`.${design}[data-theme] .${c.masthead}`, {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(180px, .55fr)',
  gap: '18px 28px',
  borderBottom: `1px solid ${tokens.color.rule}`,
  '@media': { 'screen and (max-width: 640px)': { display: 'block' } },
});
globalStyle(`.${design}[data-theme] .${c.contact}`, {
  marginTop: 0,
  display: 'grid',
  alignContent: 'start',
  '@media': { 'screen and (max-width: 640px)': { marginTop: '18px' } },
});
globalStyle(`.${design}[data-theme] .${c.summary}`, {
  gridColumn: '1 / -1',
  marginTop: 0,
  '@media': { 'screen and (max-width: 640px)': { marginTop: '22px' } },
});
