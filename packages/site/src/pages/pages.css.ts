import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

/* Long-form text: a readable measure, left-aligned with the page header. */
export const proseColumn = style({ maxWidth: '72ch' });

/* Blog */
export const postList = style({
  display: 'grid',
  gap: space[8],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const postItem = style({
  display: 'grid',
  gap: space[2],
  paddingBlockEnd: space[8],
  borderBlockEnd: `1px solid ${color.border.subtle}`,
});

export const postTitle = style({
  fontSize: font.size.xl,
  fontWeight: font.weight.regular,
});

export const byline = style({
  color: color.text.muted,
  fontSize: font.size.xs,
});

export const back = style({ marginBlockStart: space[12] });

/* Projects */
export const categoryNav = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
  margin: 0,
  marginBlockEnd: space[10],
  padding: 0,
  listStyle: 'none',
});

export const categoryLink = style({
  display: 'inline-block',
  paddingBlock: space[1],
  paddingInline: space[3],
  borderRadius: radius.full,
  border: `1px solid ${color.border.default}`,
  color: color.text.default,
  fontSize: font.size.xs,
  textDecoration: 'none',
  selectors: { '&:hover': { borderColor: color.border.strong } },
});

export const category = style({
  scrollMarginTop: space[8],
  marginBlockEnd: space[12],
});

export const categoryTitle = style({
  marginBlockEnd: space[5],
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  textTransform: 'capitalize',
});

export const projectGrid = style({
  display: 'grid',
  gap: space[4],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
});

export const projectLink = style({
  display: 'grid',
  gap: space[2],
  height: '100%',
  padding: space[4],
  color: 'inherit',
  textDecoration: 'none',
});

export const projectName = style({
  color: color.text.strong,
  fontWeight: font.weight.semibold,
  overflowWrap: 'anywhere',
});

export const projectText = style({
  color: color.text.muted,
  fontSize: font.size.xs,
  lineHeight: font.lineHeight.snug,
});

/* Team */
export const people = style({
  display: 'grid',
  gap: space[6],
  margin: 0,
  marginBlockEnd: space[12],
  padding: 0,
  listStyle: 'none',
  gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))',
});

export const person = style({
  display: 'grid',
  justifyItems: 'center',
  gap: space[2],
  textAlign: 'center',
});

export const personLinks = style({
  display: 'flex',
  gap: space[3],
  fontSize: font.size.xs,
});

export const teamTitle = style({
  marginBlockEnd: space[6],
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  '@media': { [media.md]: { fontSize: font.size['3xl'] } },
});
