import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

export const list = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: space[4],
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 18rem), 1fr))',
});

export const app = style({
  display: 'grid',
  gap: space[2],
  height: '100%',
  padding: space[5],
  color: 'inherit',
  textDecoration: 'none',
});

export const name = style({
  color: color.text.strong,
  fontSize: font.size.lg,
  fontWeight: font.weight.semibold,
});

export const description = style({
  color: color.text.default,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
});

export const more = style({
  marginBlockStart: space[8],
  color: color.text.muted,
  fontSize: font.size.sm,
});
