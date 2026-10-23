import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

export const root = style({ width: 'min(100%, 40rem)' });

export const log = style({
  height: '20rem',
  border: `1px solid ${vars.color.border.subtle}`,
  borderRadius: vars.radius.sm,
});
