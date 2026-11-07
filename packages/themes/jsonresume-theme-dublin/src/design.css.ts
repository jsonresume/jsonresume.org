import { createTheme, globalStyle } from '@vanilla-extract/css';
import { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';

export const design = createTheme(tokens, {
  ...defaults,
  color: {
    ...defaults.color,
    ink: '#24332f',
    muted: '#4b6058',
    accent: '#1f5446',
    rule: '#cbd7d0',
    sidebar: '#164c3e',
    sidebarInk: '#ffffff',
  },
  font: {
    body: '"Public Sans", Arial, sans-serif',
    display: '"Public Sans", Arial, sans-serif',
  },
  type: { size: '16px', leading: '1.6', name: '38px', heading: '18px' },
  space: { section: '31px', entry: '22px', gutter: '48px' },
  width: '980px',
});
globalStyle(`.${design} .${c.sectionTitle}`, {
  fontWeight: 600,
  border: 0,
  padding: 0,
});
globalStyle(`.${design} .${c.secondary}`, { fontSize: '15px' });
globalStyle(`.${design} .${c.secondary} .${c.sectionTitle}`, {
  borderBottom: '1px solid #8ba79e',
  paddingBottom: '7px',
  fontSize: '17px',
});
globalStyle(`.${design} .${c.secondary} .${c.definition}`, {
  marginTop: '5px',
});
globalStyle(`.${design} .${c.summary}`, {
  fontSize: '15px',
  lineHeight: 1.65,
  marginTop: '22px',
});
globalStyle(`.${design} .${c.label}`, { fontSize: '17px', lineHeight: 1.4 });
globalStyle(`.${design} .${c.portrait}`, {
  float: 'none',
  margin: '0 0 20px',
  width: '88px',
  height: '88px',
});
