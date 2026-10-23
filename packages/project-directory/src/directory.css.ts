import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

export const filters = style({
  display: 'grid',
  gap: space[4],
  marginBlockEnd: space[10],
});

export const group = style({
  marginBlockEnd: space[12],
  scrollMarginTop: space[6],
});

export const groupTitle = style({
  margin: 0,
  marginBlockEnd: space[5],
  color: color.text.strong,
  fontSize: font.size.xl,
  fontWeight: font.weight.light,
});

export const grid = style({
  display: 'grid',
  gap: space[4],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
});

export const search = style({ minWidth: 'min(100%, 22rem)' });
