import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

/* The section map in the hero: every top-level section, one tap away. */
export const map = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
  margin: 0,
  padding: space[5],
  listStyle: 'none',
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
  boxShadow: vars.shadow.md,
});

export const mapLink = style({
  display: 'inline-block',
  paddingBlock: space[1],
  paddingInline: space[3],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.full,
  color: color.text.strong,
  fontFamily: font.family.mono,
  fontSize: font.size.xs,
  textDecoration: 'none',
  '@media': { [media.coarse]: { paddingBlock: space[2] } },
  selectors: {
    '&:hover': { borderColor: color.border.strong, color: color.text.strong },
  },
});

export const principle = style({
  display: 'grid',
  gap: space[2],
  alignContent: 'start',
});

export const principleTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.md,
  fontWeight: font.weight.semibold,
});
