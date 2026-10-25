import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

/** The shell fills the viewport in the app; here it gets a fixed frame. */
export const frame = style({
  height: '44rem',
  minHeight: 0,
  overflow: 'auto',
  border: `1px solid ${vars.color.border.default}`,
});

export const panels = style({
  display: 'grid',
  gap: vars.space[6],
  gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
});

export const card = style({
  padding: vars.space[5],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.raised,
});
