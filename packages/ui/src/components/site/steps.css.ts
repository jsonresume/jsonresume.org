import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { font, color, space } = vars;

export const steps = style({
  counterReset: 'jr-step',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: space[10],
  '@media': {
    [media.md]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
      gap: space[8],
    },
  },
});

/* Vertical: one column, numbers beside the copy (for narrow columns). */
export const vertical = style({
  gap: space[8],
  '@media': {
    [media.md]: { gridTemplateColumns: 'minmax(0, 1fr)', gap: space[8] },
  },
});

export const step = style({
  counterIncrement: 'jr-step',
  display: 'grid',
  alignContent: 'start',
  gap: space[3],
  minWidth: 0,
  paddingBlockStart: space[5],
  borderBlockStart: `2px solid ${color.surface.brand}`,
  '::before': {
    content: 'counter(jr-step, decimal-leading-zero)',
    color: color.text.muted,
    fontSize: font.size['2xl'],
    fontWeight: font.weight.light,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  selectors: {
    [`${vertical} &`]: {
      gridTemplateColumns: '2.75rem minmax(0, 1fr)',
      columnGap: space[4],
      paddingBlockStart: 0,
      borderBlockStart: 'none',
    },
    [`${vertical} &::before`]: {
      gridRow: '1 / span 2',
      paddingBlockStart: space[1],
    },
  },
});

export const title = style({
  margin: 0,
  selectors: { [`${vertical} &`]: { gridColumn: 2 } },
  color: color.text.strong,
  fontSize: font.size.lg,
  fontWeight: font.weight.semibold,
  lineHeight: font.lineHeight.snug,
});

export const body = style({
  minWidth: 0,
  selectors: { [`${vertical} &`]: { gridColumn: 2 } },
  color: color.text.default,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
});
