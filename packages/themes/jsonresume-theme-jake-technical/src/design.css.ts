import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ...defaults.color,
    ink: '#161a1d',
    muted: '#41484e',
    accent: '#161a1d',
    rule: '#41484e',
  },
  font: {
    body: '"Libre Franklin", Arial, sans-serif',
    display: '"Libre Franklin", Arial, sans-serif',
  },
  type: { size: '15.5px', leading: '1.5', name: '36px', heading: '17px' },
  space: { section: '25px', entry: '16px', gutter: '43px' },
  width: '900px',
});
globalStyle(`.${design} .${c.masthead}`, {
  textAlign: 'center',
  marginBottom: '26px',
});
globalStyle(`.${design} .${c.name}`, { letterSpacing: '-0.02em' });
globalStyle(`.${design} .${c.label}`, { fontSize: '16px', fontWeight: 500 });
globalStyle(`.${design} .${c.contact}`, {
  justifyContent: 'center',
  gap: '3px 15px',
});
globalStyle(`.${design} .${c.summary}`, { textAlign: 'left' });
globalStyle(`.${design} .${c.sectionTitle}`, {
  textTransform: 'uppercase',
  paddingBottom: '5px',
  marginBottom: '11px',
  letterSpacing: '0.015em',
});
globalStyle(`.${design} .${c.context}`, {
  fontStyle: 'italic',
  fontSize: '0.95em',
});
globalStyle(`.${design} .${c.taxonomyRow}`, {
  display: 'grid',
  gridTemplateColumns: '125px minmax(0, 1fr)',
  gap: '10px',
  '@media': { 'screen and (max-width: 640px)': { display: 'block' } },
});
globalStyle(`.${design} .${c.definition}`, { marginTop: 0 });
