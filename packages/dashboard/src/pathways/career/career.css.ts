import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

/** The map: most of a phone's screen, more on a desktop. */
export const map = style({
  height: '64vh',
  minHeight: '22rem',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.lg,
  overflow: 'hidden',
  '@media': { [media.lg]: { height: '72vh' } },
});

export const controls = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[2],
});

export const reasons = style({
  display: 'grid',
  gap: space[1],
  margin: 0,
  paddingInlineStart: space[4],
  fontSize: font.size.sm,
});
export const quote = style({ color: color.text.muted });

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
});

export const steps = style({
  display: 'grid',
  gap: space[3],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const planForm = style({
  display: 'grid',
  gap: space[2],
  '@media': { [media.md]: { gridTemplateColumns: '1fr auto' } },
});
