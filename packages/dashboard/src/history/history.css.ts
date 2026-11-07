import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  width: '100%',
});

/** One version: what and who, with Restore under it on phones, beside it wider. */
export const row = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: vars.space[2],
  alignItems: 'center',
  padding: `${vars.space[3]} 0`,
  borderTop: `1px solid ${vars.color.border.subtle}`,
  selectors: { '&:first-child': { borderTop: 'none' } },
  '@media': {
    [media.sm]: { gridTemplateColumns: 'minmax(0, 1fr) auto' },
  },
});

/** Paths like work[0].highlights wrap rather than widen the page. */
export const changes = style({ overflowWrap: 'anywhere' });
