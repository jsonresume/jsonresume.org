import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

/* Building blocks shared by the designed pages. */

export const twoCol = style({
  display: 'grid',
  gap: space[12],
  alignItems: 'start',
  '@media': {
    [media.lg]: { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' },
  },
});

export const mainAside = style({
  display: 'grid',
  gap: space[10],
  alignItems: 'start',
  '@media': { [media.lg]: { gridTemplateColumns: 'minmax(0, 1fr) 13rem' } },
});

export const cardGrid = style({
  display: 'grid',
  gap: space[4],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
});

export const cardGridWide = style([
  cardGrid,
  { gridTemplateColumns: 'repeat(auto-fit, minmax(17rem, 1fr))' },
]);

export const stack = style({
  display: 'grid',
  gap: space[6],
  alignContent: 'start',
});

export const stackTight = style({
  display: 'grid',
  gap: space[3],
  alignContent: 'start',
});

export const panel = style({
  display: 'grid',
  gap: space[5],
  padding: space[6],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
});

export const panelTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.lg,
  fontWeight: font.weight.semibold,
});

export const muted = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const body = style({
  margin: 0,
  color: color.text.default,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
});

export const lead = style({
  margin: 0,
  maxWidth: '62ch',
  color: color.text.default,
  fontSize: font.size.md,
  lineHeight: font.lineHeight.normal,
});

export const stepCode = style({ marginBlockStart: space[3] });

export const linkList = style({
  display: 'grid',
  gap: space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const linkRow = style({
  display: 'grid',
  gridTemplateColumns: '6rem minmax(0, 1fr)',
  gap: space[3],
  alignItems: 'baseline',
  fontSize: font.size.sm,
});

export const linkRowLabel = style({
  color: color.text.strong,
  fontWeight: font.weight.semibold,
});

export const url = style({
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  fontFamily: font.family.mono,
  fontSize: font.size.xs,
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[3],
});

/* Cards that pair a link with a code sample (the code is not inside the link). */
export const toolCard = style([
  panel,
  { gap: space[3], alignContent: 'start' },
]);

export const toolTitle = style({
  margin: 0,
  fontSize: font.size.md,
  fontWeight: font.weight.semibold,
});

export const eyebrow = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const pathCards = style([
  cardGrid,
  { gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))' },
]);

export const spaced = style({ marginBlockEnd: space[10] });

/* Long-form text: a readable measure, left-aligned with the page. */
export const prose = style({ maxWidth: '72ch' });

/* Exactly two columns from md up (four items read as a 2x2 grid). */
export const cardGrid2 = style([
  cardGrid,
  {
    '@media': {
      [media.md]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    },
  },
]);

/* A search field wide enough for its placeholder. */
export const searchField = style({ minWidth: 'min(100%, 22rem)' });
