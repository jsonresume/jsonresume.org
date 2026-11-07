import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ...defaults.color,
    ink: '#202020',
    muted: '#484848',
    accent: '#202020',
    rule: '#777777',
  },
  font: {
    body: '"Libre Baskerville", Georgia, serif',
    display: '"Libre Baskerville", Georgia, serif',
  },
  type: { size: '15.5px', leading: '1.65', name: '33px', heading: '17px' },
  space: { section: '29px', entry: '20px', gutter: '54px' },
  width: '900px',
});
globalStyle(`.${design} .${c.masthead}`, {
  textAlign: 'center',
  paddingBottom: '24px',
  borderBottom: '1px solid #777',
});
globalStyle(`.${design} .${c.name}`, {
  letterSpacing: '0.01em',
  fontWeight: 700,
});
globalStyle(`.${design} .${c.label}`, {
  fontSize: '16px',
  color: tokens.color.muted,
});
globalStyle(`.${design} .${c.contact}`, {
  justifyContent: 'center',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
});
globalStyle(`.${design} .${c.summary}`, {
  textAlign: 'left',
  marginTop: '24px',
});
globalStyle(`.${design} .${c.sectionTitle}`, {
  textTransform: 'uppercase',
  letterSpacing: '0.025em',
  borderBottomColor: '#777',
});
globalStyle(`.${design} .${c.context}`, { fontStyle: 'italic' });
globalStyle(`.${design} .${c.date}`, { fontFamily: 'Arial, sans-serif' });
globalStyle(`.${design} .${c.taxonomyRow}`, {
  display: 'grid',
  gridTemplateColumns: '135px minmax(0, 1fr)',
  gap: '12px',
  '@media': { 'screen and (max-width: 640px)': { display: 'block' } },
});
