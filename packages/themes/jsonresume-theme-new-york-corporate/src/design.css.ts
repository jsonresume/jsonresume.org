import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ...defaults.color,
    ink: '#252d36',
    muted: '#515c69',
    accent: '#293e57',
    rule: '#b7bec7',
  },
  font: {
    body: '"Source Sans 3", Arial, sans-serif',
    display: '"Libre Caslon Text", Georgia, serif',
  },
  type: { size: '16px', leading: '1.6', name: '38px', heading: '18px' },
  space: { section: '32px', entry: '26px', gutter: '48px' },
  width: '960px',
});
globalStyle(`.${design} .${c.masthead}`, {
  textAlign: 'center',
  borderBottom: `1px solid ${tokens.color.accent}`,
  paddingBottom: '25px',
});
globalStyle(`.${design} .${c.name}`, {
  fontWeight: 400,
  letterSpacing: '0.005em',
});
globalStyle(`.${design} .${c.label}`, {
  fontFamily: '"Source Sans 3", Arial, sans-serif',
  fontSize: '17px',
});
globalStyle(`.${design} .${c.contact}`, { justifyContent: 'center' });
globalStyle(`.${design} .${c.summary}`, { textAlign: 'left' });
globalStyle(`.${design} .${c.sectionTitle}`, {
  fontWeight: 400,
  borderBottom: 0,
  paddingBottom: 0,
});
globalStyle(`.${design} .${c.entryTitle}`, {
  fontFamily: '"Libre Caslon Text", Georgia, serif',
  fontSize: '15px',
  fontWeight: 700,
});
globalStyle(`.${design} .${c.secondary}`, {
  borderInlineStart: `1px solid ${tokens.color.rule}`,
  paddingInlineStart: '24px',
  fontSize: '15px',
  '@media': {
    'screen and (max-width: 640px)': { border: 0, paddingInlineStart: 0 },
  },
});
