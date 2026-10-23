import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

/** The container width, set from the slider. */
export const width = createVar();

export const frame = style({
  width,
  padding: vars.space[2],
  outline: `1px dashed ${vars.color.border.strong}`,
  vars: { [width]: '100%' },
});
