import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

export const fieldset = style({
  border: 0,
  margin: 0,
  padding: 0,
  minWidth: 0,
});

export const options = style({ marginTop: vars.space[3] });
