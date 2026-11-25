import { media, vars } from '@jsonresume/ui/tokens';
import { globalStyle, style } from '@vanilla-extract/css';

const { space, color, font } = vars;

export const controls = style({
  display: 'grid',
  gap: space[3],
  marginBlock: space[6],
  '@media': {
    [media.md]: {
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      alignItems: 'center',
    },
  },
});

export const count = style({
  color: color.text.muted,
  fontSize: font.size.sm,
  margin: 0,
  marginBlockStart: space[10],
});

export const people = style({
  display: 'grid',
  gap: space[4],
  margin: 0,
  marginBlockStart: space[4],
  padding: 0,
  listStyle: 'none',
  '@media': {
    [media.md]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    [media.lg]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  },
});

export const person = style({
  display: 'flex',
  gap: space[3],
  alignItems: 'flex-start',
  minWidth: 0,
});

export const who = style({
  display: 'grid',
  gap: space[1],
  minWidth: 0,
});

export const name = style({
  fontWeight: font.weight.semibold,
  overflowWrap: 'anywhere',
});

export const handle = style({
  color: color.text.muted,
  fontSize: font.size.sm,
  overflowWrap: 'anywhere',
});

export const credits = style({
  display: 'grid',
  gap: '0.125rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  fontSize: font.size.sm,
});

globalStyle(`${credits} a`, {
  color: color.text.default,
  overflowWrap: 'anywhere',
});

export const more = style({
  fontSize: font.size.sm,
  color: color.text.muted,
});

export const note = style({
  color: color.text.muted,
  fontSize: font.size.sm,
  marginBlockStart: space[8],
});
