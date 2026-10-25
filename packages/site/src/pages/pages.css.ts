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
  maxWidth: '62ch',
  paddingBlockEnd: space[8],
  borderBlockEnd: `1px solid ${color.border.subtle}`,
});

export const postTitle = style({
  margin: 0,
  fontSize: font.size.xl,
  fontWeight: font.weight.regular,
});

export const year = style({
  display: 'grid',
  gap: space[6],
  marginBlockEnd: space[12],
  '@media': { [media.md]: { gridTemplateColumns: '8rem minmax(0, 1fr)' } },
});

export const yearTitle = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  fontVariantNumeric: 'tabular-nums',
});

export const neighbours = style({
  display: 'grid',
  gap: space[4],
  marginBlockStart: space[16],
  '@media': { [media.md]: { gridTemplateColumns: '1fr 1fr' } },
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

export const ways = style({
  display: 'grid',
  gap: space[2],
  margin: 0,
  paddingInlineStart: space[5],
  fontSize: font.size.md,
});

export const story = style({
  display: 'grid',
  gap: space[10],
  marginBlockEnd: space[16],
});

export const chapter = style({
  display: 'grid',
  gap: space[4],
  '@media': {
    [media.md]: { gridTemplateColumns: '15rem minmax(0, 1fr)', gap: space[10] },
  },
});

export const chapterTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.lg,
  fontWeight: font.weight.semibold,
  lineHeight: font.lineHeight.snug,
});

export const chapterBody = style({
  display: 'grid',
  gap: space[4],
  maxWidth: '62ch',
});

/* NotFoundPage */

export const lostSearch = style({
  display: 'grid',
  gap: space[3],
  maxWidth: '36rem',
  '@media': {
    [media.sm]: { gridTemplateColumns: 'minmax(0, 1fr) auto' },
  },
});
