import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ...defaults.color,
    ink: '#292c33',
    muted: '#555962',
    accent: '#333a49',
    rule: '#b9bdc6',
  },
  font: {
    body: 'Lato, Arial, sans-serif',
    display: 'Raleway, Arial, sans-serif',
  },
  type: { size: '15.5px', leading: '1.5', name: '56px', heading: '19px' },
  space: { section: '26px', entry: '18px', gutter: '44px' },
  width: '960px',
});
globalStyle(`.${design} .${c.masthead}`, {
  textAlign: 'center',
  borderBottom: `1px solid ${tokens.color.rule}`,
  paddingBottom: '24px',
});
globalStyle(`.${design} .${c.name}`, {
  fontWeight: 400,
  letterSpacing: '-0.025em',
});
globalStyle(`.${design} .${c.label}`, {
  fontFamily: 'Lato, Arial, sans-serif',
  fontSize: '17px',
});
globalStyle(`.${design} .${c.contact}`, { justifyContent: 'center' });
globalStyle(`.${design} .${c.summary}`, { textAlign: 'left' });
globalStyle(`.${design} .${c.sectionTitle}`, {
  fontWeight: 600,
  textTransform: 'uppercase',
  border: 0,
  padding: 0,
  letterSpacing: '0.015em',
});
globalStyle(`.${design} .${c.secondary}`, { fontSize: '15px' });
globalStyle(`.${design} .${c.secondary} .${c.entryHead}`, { display: 'block' });
globalStyle(`.${design} .${c.secondary} .${c.date}`, { marginTop: '4px' });
globalStyle(`.${design} .${c.context}`, { fontSize: '0.94em' });
