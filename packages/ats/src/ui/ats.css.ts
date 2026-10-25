import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

export const issues = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: vars.space[3],
});

export const issue = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: vars.space[3],
  rowGap: vars.space[1],
  alignItems: 'baseline',
});

/** The fix and the field sit under the message, beside the badge. */
export const detail = style({ gridColumn: '2' });
