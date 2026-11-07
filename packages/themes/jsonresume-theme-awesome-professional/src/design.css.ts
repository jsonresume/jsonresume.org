import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ...defaults.color,
    ink: '#272a30',
    muted: '#525660',
    accent: '#a52e3b',
    rule: '#c9cbd0',
  },
  font: {
    body: 'Roboto, Arial, sans-serif',
    display: '"Roboto Slab", Georgia, serif',
  },
  type: { size: '16px', leading: '1.55', name: '45px', heading: '19px' },
  space: { section: '32px', entry: '21px', gutter: '50px' },
});
globalStyle(`.${design} .${c.name}`, {
  fontWeight: 600,
  letterSpacing: '-0.025em',
});
globalStyle(`.${design} .${c.label}`, {
  fontFamily: 'Roboto, Arial, sans-serif',
  fontWeight: 500,
});
globalStyle(`.${design} .${c.contact}`, { gap: '5px 20px' });
globalStyle(`.${design} .${c.sectionTitle}`, {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  border: 0,
  paddingBottom: 0,
});
globalStyle(`.${design} .${c.sectionTitle}::after`, {
  content: '""',
  flex: 1,
  borderTop: `1px solid ${tokens.color.rule}`,
});
globalStyle(`.${design} .${c.entryTitle}`, { fontWeight: 700 });
globalStyle(`.${design} .${c.context}`, {
  color: tokens.color.accent,
  fontSize: '0.95em',
});
globalStyle(`.${design} .${c.taxonomy}`, {
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  columnGap: '28px',
  '@media': { 'screen and (max-width: 640px)': { gridTemplateColumns: '1fr' } },
});
