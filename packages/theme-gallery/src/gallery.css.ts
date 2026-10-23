import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

export const grid = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: space[6],
  gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
});

export const cardLink = style({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  alignContent: 'start',
  height: '100%',
  color: 'inherit',
  textDecoration: 'none',
});

export const shot = style({
  width: '100%',
  height: 'auto',
  aspectRatio: '5 / 4',
  objectFit: 'cover',
  objectPosition: 'top',
  borderBlockEnd: `1px solid ${color.border.subtle}`,
});

export const body = style({
  display: 'grid',
  gap: space[1],
  padding: space[4],
});

export const name = style({
  color: color.text.strong,
  fontSize: font.size.md,
  fontWeight: font.weight.semibold,
});

export const description = style({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  color: color.text.muted,
  fontSize: font.size.xs,
  lineHeight: font.lineHeight.snug,
});

export const filters = style({ marginBlockEnd: space[8] });

export const empty = style({ paddingBlock: space[12] });
