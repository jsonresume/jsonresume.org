import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

export const layout = style({
  display: 'grid',
  gap: space[8],
  marginBlockStart: space[6],
  '@media': {
    [media.lg]: { gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)' },
  },
});

export const shotLink = style({
  display: 'block',
  alignSelf: 'start',
  border: `1px solid ${color.border.subtle}`,
  borderRadius: radius.lg,
  overflow: 'hidden',
});

export const shot = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  aspectRatio: '5 / 4',
  objectFit: 'cover',
  objectPosition: 'top',
});

export const side = style({
  display: 'grid',
  alignContent: 'start',
  gap: space[8],
  minWidth: 0,
});

export const similarTitle = style({
  margin: `0 0 ${space[6]}`,
  color: color.text.strong,
  fontSize: font.size.xl,
  fontWeight: font.weight.regular,
});
