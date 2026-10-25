import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { space } = vars;

export const body = style({ display: 'grid', gap: space[8] });

export const highlights = style({
  margin: 0,
  paddingInlineStart: space[5],
  display: 'grid',
  gap: space[1],
});
