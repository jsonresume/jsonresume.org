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

export const filters = style({ marginBlockEnd: space[4] });

export const styles = style({ marginBlockEnd: space[3] });

export const usageNote = style({
  fontSize: font.size.xs,
  color: color.text.muted,
  lineHeight: font.lineHeight.normal,
  marginBlockEnd: space[6],
  maxWidth: '70ch',
});
export const category = style({
  fontSize: font.size.xs,
  color: color.text.muted,
});
export const usage = style({
  fontSize: font.size.xs,
  fontWeight: font.weight.semibold,
  marginBlockStart: space[2],
});

export const empty = style({ paddingBlock: space[12] });

export const search = style({ minWidth: 'min(100%, 22rem)' });

export const facet = style({
  // Override FilterBar's compact phone basis for the longer theme options.
  selectors: {
    '&&': { flex: '1 1 10rem', minWidth: 'min(100%, 10rem)' },
  },
});

export const sortFacet = style({
  selectors: {
    '&&': { flex: '1 1 14rem', minWidth: 'min(100%, 14rem)' },
  },
});
