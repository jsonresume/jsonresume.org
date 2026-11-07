import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

export const layout = style({
  display: 'grid',
  gap: space[8],
  '@media': {
    [media.lg]: { gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' },
  },
});

export const resume = style({
  display: 'grid',
  gap: space[3],
  padding: space[6],
  border: `1px solid ${color.border.subtle}`,
  borderRadius: radius.lg,
  backgroundColor: color.surface.raised,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
});

export const person = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.xl,
  fontWeight: font.weight.semibold,
});
export const label = style({ margin: 0, color: color.text.muted });
export const section = style({
  margin: `${space[3]} 0 0`,
  paddingBlockEnd: space[1],
  borderBlockEnd: `1px solid ${color.border.subtle}`,
  color: color.text.strong,
  fontSize: font.size.md,
});
export const role = style({ margin: 0, fontWeight: font.weight.semibold });
export const years = style({
  color: color.text.muted,
  fontWeight: font.weight.regular,
});
export const muted = style({ margin: 0, color: color.text.muted });

export const tips = style({
  display: 'grid',
  alignContent: 'start',
  gap: space[3],
});

export const list = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: space[4],
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 16rem), 1fr))',
});

export const card = style({
  display: 'grid',
  gap: space[1],
  height: '100%',
  padding: space[5],
  color: 'inherit',
  textDecoration: 'none',
});
export const cardRole = style({
  color: color.text.strong,
  fontSize: font.size.lg,
  fontWeight: font.weight.semibold,
});

/** /examples: a directory of fields, each a heading over its roles. */
export const fields = style({
  display: 'grid',
  gap: `${space[8]} ${space[6]}`,
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 15rem), 1fr))',
  alignItems: 'start',
});

export const fieldName = style({ marginBottom: space[3] });

export const roles = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: space[2],
});
