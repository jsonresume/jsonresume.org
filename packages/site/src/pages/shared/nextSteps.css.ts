import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { font, space } = vars;

export const band = style({
  display: 'grid',
  gap: space[6],
  alignItems: 'center',
  '@media': { [media.md]: { gridTemplateColumns: 'minmax(0, 1fr) auto' } },
});

export const title = style({
  margin: 0,
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[3],
});
