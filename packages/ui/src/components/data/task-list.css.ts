import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { color, font, space, radius } = vars;

export const progress = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[3],
  marginBlockEnd: space[2],
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const track = style({
  flex: 1,
  maxWidth: '12rem',
  height: '4px',
  borderRadius: radius.full,
  backgroundColor: color.surface.muted,
  overflow: 'hidden',
});

/** How much of the bar is filled, e.g. "50%". */
export const filled = createVar();

export const fill = style({
  display: 'block',
  width: filled,
  height: '100%',
  borderRadius: radius.full,
  backgroundColor: color.status.success,
});

export const list = style({
  display: 'grid',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const item = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: `${space[1]} ${space[3]}`,
  alignItems: 'start',
  paddingBlock: space[4],
  selectors: {
    '& + &': { borderBlockStart: `1px solid ${color.border.subtle}` },
  },
  '@media': {
    [media.sm]: { gridTemplateColumns: 'auto minmax(0, 1fr) auto' },
  },
});

export const marker = recipe({
  base: {
    gridRow: '1 / span 2',
    display: 'inline-grid',
    placeItems: 'center',
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: radius.full,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    fontVariantNumeric: 'tabular-nums',
  },
  variants: {
    done: {
      true: {
        backgroundColor: color.status.success,
        color: color.text.inverse,
      },
      false: {
        border: `1.5px solid ${color.border.strong}`,
        color: color.text.muted,
      },
    },
  },
});

export const title = recipe({
  base: {
    margin: 0,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    lineHeight: '1.5rem',
  },
  variants: {
    done: {
      true: { color: color.text.muted },
      false: { color: color.text.strong },
    },
  },
});

export const optional = style({
  marginInlineStart: space[2],
  color: color.text.muted,
  fontSize: font.size.xs,
  fontWeight: font.weight.regular,
});

export const text = style({
  gridColumn: 2,
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const action = style({
  gridColumn: 2,
  marginBlockStart: space[2],
  '@media': {
    [media.sm]: {
      gridColumn: 3,
      gridRow: '1 / span 2',
      alignSelf: 'center',
      marginBlockStart: 0,
    },
  },
});
