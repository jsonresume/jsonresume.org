import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

export const layout = style({
  display: 'grid',
  gap: space[10],
  '@media': {
    [media.lg]: {
      gridTemplateColumns: 'minmax(0, 1fr) 12rem',
      alignItems: 'start',
    },
  },
});

// The index is for wide screens; on phones the page's own section map serves.
export const aside = style({
  display: 'none',
  '@media': {
    [media.lg]: {
      display: 'block',
      position: 'sticky',
      insetBlockStart: space[6],
    },
  },
});

// minWidth 0 and minmax(0, 1fr) everywhere: long lines in the examples must
// scroll inside their code block, not widen the page.
export const sections = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: space[16],
  minWidth: 0,
});

export const section = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: space[4],
  minWidth: 0,
  scrollMarginTop: space[6],
});

export const sectionHead = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: space[3],
});

export const sectionName = style({
  margin: 0,
  color: color.text.strong,
  fontFamily: font.family.mono,
  fontSize: font.size.xl,
  fontWeight: font.weight.semibold,
});

export const sectionText = style({
  margin: 0,
  maxWidth: '65ch',
  color: color.text.default,
  fontSize: font.size.md,
});

export const fieldName = style({
  fontFamily: font.family.mono,
  fontSize: font.size.xs,
  color: color.text.strong,
  whiteSpace: 'nowrap',
});

export const fieldParent = style({ color: color.text.muted });

export const fieldType = style({
  color: color.text.muted,
  fontSize: font.size.xs,
  whiteSpace: 'nowrap',
});

export const fieldText = style({ fontSize: font.size.xs, minWidth: '16rem' });

export const example = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: space[2],
  minWidth: 0,
});

export const exampleSummary = style({
  cursor: 'pointer',
  paddingBlock: space[1],
  '@media': { [media.coarse]: { paddingBlock: space[3] } },
  color: color.text.muted,
  fontSize: font.size.xs,
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const groupName = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.xl,
  fontWeight: font.weight.semibold,
});
