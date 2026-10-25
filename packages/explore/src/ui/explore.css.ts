import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { space } = vars;

export const search = style({
  display: 'grid',
  gap: space[3],
  '@media': {
    [media.md]: { gridTemplateColumns: 'minmax(0, 1fr) auto' },
  },
});

export const skills = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const results = style({
  display: 'grid',
  gap: space[6],
});
