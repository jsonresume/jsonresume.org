import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

export const frame = style({
  height: '16rem',
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.raised,
});

export const pane = style({
  display: 'grid',
  alignContent: 'start',
  gap: vars.space[2],
  padding: vars.space[4],
});

export const code = style({
  margin: 0,
  fontFamily: vars.font.family.mono,
  fontSize: vars.font.size.xs,
});
