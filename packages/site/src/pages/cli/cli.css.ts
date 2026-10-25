import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

export const installPanel = style({
  display: 'grid',
  gap: space[3],
  padding: space[5],
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
  boxShadow: vars.shadow.md,
});

export const command = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: space[4],
  minWidth: 0,
  paddingBlockStart: space[10],
  borderBlockStart: `1px solid ${color.border.subtle}`,
  scrollMarginTop: space[6],
});

export const usage = style({
  margin: 0,
  color: color.text.strong,
  fontFamily: font.family.mono,
  fontSize: font.size.lg,
  fontWeight: font.weight.semibold,
});

export const summary = style({
  margin: 0,
  color: color.text.default,
  fontSize: font.size.md,
});

export const flag = style({
  fontFamily: font.family.mono,
  fontSize: font.size.xs,
  whiteSpace: 'nowrap',
});

export const tips = style({
  display: 'grid',
  gap: space[3],
  margin: 0,
  paddingInlineStart: space[5],
  fontSize: font.size.sm,
});

export const commands = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: space[12],
  minWidth: 0,
});
