import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ...defaults.color,
    ink: '#23323a',
    muted: '#4d626e',
    accent: '#235970',
    rule: '#c7d7dd',
    soft: '#edf4f6',
  },
  font: {
    body: 'Figtree, Arial, sans-serif',
    display: 'Figtree, Arial, sans-serif',
  },
  type: { size: '16px', leading: '1.6', name: '40px', heading: '19px' },
  space: { section: '32px', entry: '23px', gutter: '48px' },
  width: '980px',
});
globalStyle(`.${design} .${c.masthead}`, {
  paddingBottom: '26px',
  borderBottom: `1px solid ${tokens.color.rule}`,
});
globalStyle(`.${design} .${c.name}`, {
  fontWeight: 600,
  letterSpacing: '-0.025em',
});
globalStyle(`.${design} .${c.sectionTitle}`, {
  border: 0,
  padding: 0,
  fontSize: '18px',
  fontWeight: 700,
});
globalStyle(`.${design} .${c.secondary}`, {
  paddingInlineStart: '24px',
  borderInlineStart: `1px solid ${tokens.color.rule}`,
  fontSize: '15px',
  '@media': {
    'screen and (max-width: 640px)': { paddingInlineStart: 0, border: 0 },
  },
});
globalStyle(`.${design} .${c.secondary} .${c.sectionTitle}`, {
  fontSize: '16px',
});
globalStyle(`.${design} .${c.secondary} .${c.term}`, { fontWeight: 600 });
globalStyle(`.${design} .${c.context}`, { marginTop: '5px' });
