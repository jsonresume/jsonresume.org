import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

/** The four marks: one even row across a phone, a compact row on desktop. */
export const marks = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: vars.space[1],
  width: '100%',
  '@media': {
    [media.md]: { display: 'flex', width: 'auto' },
  },
});
