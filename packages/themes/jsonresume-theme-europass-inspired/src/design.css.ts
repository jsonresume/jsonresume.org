import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ...defaults.color,
    ink: '#203144',
    muted: '#4b5e71',
    accent: '#1456a0',
    rule: '#b9cce1',
    soft: '#edf3fa',
  },
  font: {
    body: '"Source Sans 3", Arial, sans-serif',
    display: '"Source Sans 3", Arial, sans-serif',
  },
  type: { size: '16px', leading: '1.6', name: '43px', heading: '19px' },
  space: { section: '31px', entry: '24px', gutter: '48px' },
  width: '960px',
});
globalStyle(`.${design} .${c.name}`, {
  color: tokens.color.accent,
  fontWeight: 600,
});
globalStyle(`.${design} .${c.label}`, {
  fontSize: '20px',
  color: tokens.color.ink,
});
globalStyle(`.${design} .${c.contact}`, { fontSize: '15px', gap: '5px 20px' });
globalStyle(`.${design} .${c.sectionTitle}`, {
  background: tokens.color.soft,
  borderBottom: 0,
  padding: '8px 12px',
  fontWeight: 600,
});
globalStyle(`.${design} .${c.date}`, {
  color: tokens.color.accent,
  fontWeight: 600,
});
globalStyle(`.${design} .${c.context}`, { fontWeight: 600 });
globalStyle(`.${design} .${c.taxonomyRow}`, {
  display: 'grid',
  gridTemplateColumns: '115px minmax(0, 1fr)',
  columnGap: '22px',
  '@media': { 'screen and (max-width: 640px)': { display: 'block' } },
});
