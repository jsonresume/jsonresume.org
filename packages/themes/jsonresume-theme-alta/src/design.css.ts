import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ...defaults.color,
    ink: '#302b32',
    muted: '#5e515f',
    accent: '#763953',
    rule: '#c7b3bd',
    soft: '#f5eef1',
  },
  font: {
    body: 'Lato, Arial, sans-serif',
    display: '"Merriweather Sans", Arial, sans-serif',
  },
  type: { size: '16px', leading: '1.55', name: '42px', heading: '18px' },
  space: { section: '31px', entry: '23px', gutter: '46px' },
  width: '980px',
});
globalStyle(`.${design} .${c.name}`, {
  color: tokens.color.accent,
  letterSpacing: '-0.015em',
});
globalStyle(`.${design} .${c.label}`, {
  color: tokens.color.ink,
  fontWeight: 700,
  fontSize: '19px',
});
globalStyle(`.${design} .${c.sectionTitle}`, {
  textTransform: 'uppercase',
  paddingBottom: '9px',
  letterSpacing: '0.015em',
});
globalStyle(`.${design} .${c.context}`, { color: tokens.color.accent });
globalStyle(`.${design} .${c.secondary}`, { fontSize: '15px' });
globalStyle(`.${design} .${c.secondary} .${c.entryHead}`, { display: 'block' });
globalStyle(`.${design} .${c.secondary} .${c.date}`, { marginTop: '5px' });
globalStyle(`.${design} .${c.secondary} .${c.sectionTitle}`, {
  fontSize: '16px',
});
