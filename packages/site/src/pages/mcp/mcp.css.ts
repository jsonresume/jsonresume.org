import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

export const urlPanel = style({
  display: 'grid',
  gap: space[3],
  padding: space[5],
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
  boxShadow: vars.shadow.md,
  minWidth: 0,
});

export const section = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: space[4],
  minWidth: 0,
  paddingBlockStart: space[10],
  scrollMarginTop: space[6],
});

export const client = style({
  display: 'grid',
  gap: space[3],
  paddingBlock: space[5],
  borderBlockStart: `1px solid ${color.border.subtle}`,
  scrollMarginTop: space[6],
  minWidth: 0,
});

export const clientHead = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[2],
});

export const clientName = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.lg,
  fontWeight: font.weight.semibold,
});

export const steps = style({
  display: 'grid',
  gap: space[2],
  margin: 0,
  paddingInlineStart: space[5],
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
});

export const tools = style({
  display: 'grid',
  gap: space[4],
  alignItems: 'start',
  '@media': {
    [media.md]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
});

export const toolList = style({
  display: 'grid',
  gap: space[3],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const toolName = style({
  fontFamily: font.family.mono,
  fontSize: font.size.sm,
  fontWeight: font.weight.semibold,
  color: color.text.strong,
});

export const toolText = style({
  margin: 0,
  color: color.text.default,
  fontSize: font.size.sm,
});

export const examples = style({
  display: 'grid',
  gap: space[2],
  margin: 0,
  paddingInlineStart: space[5],
  fontSize: font.size.md,
});
