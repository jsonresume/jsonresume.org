import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

/** The chat: messages above, the composer under them (pinned on phones). */
export const chat = style({
  display: 'grid',
  gridTemplateRows: 'minmax(0, 1fr) auto',
  gap: space[3],
  minHeight: '60vh',
  '@media': { [media.lg]: { height: '100%', minHeight: 0 } },
});

export const composer = style({
  position: 'sticky',
  bottom: 0,
  paddingBlock: space[3],
  backgroundColor: color.surface.page,
});

export const starters = style({
  display: 'grid',
  gap: space[2],
  '@media': {
    [media.md]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
});

export const starter = style({
  padding: space[4],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.lg,
  background: color.surface.raised,
  color: color.text.default,
  font: 'inherit',
  fontSize: font.size.sm,
  textAlign: 'start',
  cursor: 'pointer',
  selectors: { '&:hover': { borderColor: color.border.strong } },
});

export const tools = style({
  display: 'grid',
  gap: space[1],
  marginBlockEnd: space[2],
});

export const directions = style({
  display: 'grid',
  gap: space[4],
  '@media': {
    [media.lg]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
});

export const facts = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
  alignItems: 'center',
});

export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[1],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const label = style({
  color: color.text.muted,
  fontSize: font.size.xs,
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const examples = style({
  display: 'grid',
  gap: space[1],
  margin: 0,
  paddingInlineStart: space[4],
  fontSize: font.size.sm,
});
