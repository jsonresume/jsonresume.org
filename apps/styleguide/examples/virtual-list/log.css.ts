import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

export const frame = style({
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.raised,
});

export const row = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space[3],
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderBottom: `1px solid ${vars.color.border.subtle}`,
});
