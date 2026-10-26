import { media, vars } from '@jsonresume/ui/tokens';
import { globalStyle, style } from '@vanilla-extract/css';

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

// The badges stay small; on touch screens the links around them grow.
globalStyle(`${skills} a`, {
  '@media': {
    [media.coarse]: {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: '2.5rem',
    },
  },
});

export const results = style({
  display: 'grid',
  gap: space[6],
});
