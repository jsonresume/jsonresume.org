import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ...defaults.color,
    ink: '#252d32',
    muted: '#4e5960',
    accent: '#1d5575',
    rule: '#b7c9d3',
  },
  font: {
    body: '"PT Serif", Georgia, serif',
    display: '"PT Sans", Arial, sans-serif',
  },
  type: { size: '16px', leading: '1.6', name: '42px', heading: '20px' },
  space: { section: '32px', entry: '21px', gutter: '50px' },
  width: '960px',
});
globalStyle(`.${design} .${c.masthead}`, {
  display: 'grid',
  gridTemplateColumns: '1fr minmax(180px, .65fr)',
  columnGap: '30px',
  '@media': { 'screen and (max-width: 640px)': { display: 'block' } },
});
globalStyle(`.${design} .${c.name}`, {
  fontWeight: 400,
  color: tokens.color.accent,
});
globalStyle(`.${design} .${c.contact}`, {
  display: 'block',
  textAlign: 'right',
  marginTop: '4px',
  fontFamily: '"PT Sans", Arial, sans-serif',
  '@media': {
    'screen and (max-width: 640px)': { textAlign: 'left', marginTop: '16px' },
  },
});
globalStyle(`.${design} .${c.summary}`, {
  gridColumn: '1 / -1',
  maxWidth: 'none',
});
globalStyle(`.${design} .${c.sectionTitle}`, {
  fontWeight: 400,
  borderBottom: `1px solid ${tokens.color.rule}`,
});
globalStyle(`.${design} .${c.date}`, {
  fontFamily: '"PT Sans", Arial, sans-serif',
  color: tokens.color.accent,
});
globalStyle(`.${design} .${c.context}`, { fontStyle: 'italic' });
