import { createVar, style } from '@vanilla-extract/css';
import { focusRing } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { color, font, space } = vars;

/** The bar's length as a share of the largest value. */
export const fill = createVar();

/** Stays at the top when a grid stretches it beside a longer list. */
export const root = style({ alignContent: 'start' });

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: space[3],
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const list = style({
  display: 'grid',
  gap: space[3],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const item = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'baseline',
  gap: `${space[1]} ${space[3]}`,
  fontSize: font.size.sm,
});

export const label = style({
  minWidth: 0,
  overflow: 'hidden',
  color: color.text.default,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const link = style([
  focusRing,
  {
    color: color.text.default,
    textDecoration: 'none',
    selectors: {
      '&:hover': { color: color.text.link, textDecoration: 'underline' },
    },
  },
]);

export const detail = style({
  color: color.text.muted,
  fontSize: font.size.xs,
});

export const value = style({
  display: 'inline-flex',
  gap: space[2],
  color: color.text.strong,
  fontWeight: font.weight.semibold,
  fontVariantNumeric: 'tabular-nums',
});

/** Share of the total, shown while the row is hovered or focused. */
export const share = style({
  color: color.text.muted,
  fontWeight: font.weight.regular,
  opacity: 0,
  selectors: {
    [`${item}:hover &, ${item}:focus-within &`]: { opacity: 1 },
  },
});

/** Thin bar from a square baseline to a 4px rounded end. */
export const bar = style({
  gridColumn: '1 / -1',
  width: fill,
  minWidth: '2px',
  height: '6px',
  borderRadius: '0 4px 4px 0',
  backgroundColor: color.chart.series1,
});

export const barOther = style({ backgroundColor: color.chart.deemphasis });

export const empty = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});
