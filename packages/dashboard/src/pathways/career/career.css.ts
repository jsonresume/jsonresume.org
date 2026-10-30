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

export const legend = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space[1]} ${space[4]}`,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  color: color.text.muted,
  fontSize: font.size.sm,
});

/** A key square, drawn as the map draws its tones. */
export const swatch = style({
  display: 'inline-block',
  width: '0.75rem',
  height: '0.75rem',
  marginInlineEnd: space[1],
  verticalAlign: '-0.05rem',
  border: `1.5px solid ${color.text.muted}`,
});
export const have = style({
  background: color.status.success,
  borderColor: color.status.success,
});
export const gap = style({
  borderColor: color.status.warning,
  background: `repeating-linear-gradient(135deg, ${color.status.warning} 0 2px, transparent 2px 5px)`,
});
/** Outlined, with the map's green corner. */
export const mine = style({
  borderColor: color.status.success,
  background: `linear-gradient(135deg, transparent 55%, ${color.status.success} 55%)`,
});
export const open = style({ background: 'transparent' });

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
