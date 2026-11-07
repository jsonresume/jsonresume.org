import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

export const root = style({ width: 'min(100%, 22rem)' });

export const inline = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  whiteSpace: 'nowrap',
});
