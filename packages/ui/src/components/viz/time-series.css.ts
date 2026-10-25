import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/contract.css';

const { color, font, space, radius, shadow, motion, zIndex } = vars;

/** Tooltip position inside the plot, set from the pointer. */
export const tipX = createVar();
export const tipY = createVar();

export const frame = style({
  width: '100%',
  minWidth: 0,
  transition: `opacity ${motion.duration.base} ${motion.easing.standard}`,
});

/** Refetching: the previous render stays, quieter. */
export const loading = style({ opacity: 0.55 });

export const plot = style({
  position: 'relative',
  width: '100%',
  minWidth: 0,
  borderRadius: radius.sm,
  outline: 'none',
  selectors: {
    '&:focus-visible': {
      boxShadow: `0 0 0 2px ${color.focus}`,
    },
  },
});

export const svg = style({ display: 'block', overflow: 'visible' });

export const grid = style({ stroke: color.chart.grid, strokeWidth: 1 });

export const baseline = style({ stroke: color.border.default, strokeWidth: 1 });

export const tick = style({
  fill: color.text.muted,
  fontSize: '11px',
  fontFamily: font.family.sans,
  fontVariantNumeric: 'tabular-nums',
});

const seriesColor = [color.chart.series1, color.chart.series2] as const;

export const area = recipe({
  base: { stroke: 'none', fillOpacity: 0.1 },
  variants: {
    index: { 0: { fill: seriesColor[0] }, 1: { fill: seriesColor[1] } },
  },
});

export const line = recipe({
  base: {
    fill: 'none',
    strokeWidth: 2,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
  },
  variants: {
    index: { 0: { stroke: seriesColor[0] }, 1: { stroke: seriesColor[1] } },
  },
});

/** Data dots carry a 2px ring in the surface colour. */
export const dot = recipe({
  base: { stroke: color.surface.raised, strokeWidth: 2 },
  variants: {
    index: { 0: { fill: seriesColor[0] }, 1: { fill: seriesColor[1] } },
  },
});

export const crosshair = style({
  stroke: color.border.strong,
  strokeWidth: 1,
  pointerEvents: 'none',
});

export const hit = style({ fill: 'transparent', cursor: 'crosshair' });

export const empty = style({
  fill: color.text.muted,
  fontSize: font.size.sm,
  fontFamily: font.family.sans,
});

export const tooltip = style({
  position: 'absolute',
  insetInlineStart: tipX,
  insetBlockStart: tipY,
  zIndex: zIndex.tooltip,
  display: 'grid',
  gap: space[1],
  minWidth: '9rem',
  padding: `${space[2]} ${space[3]}`,
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
  boxShadow: shadow.md,
  fontSize: font.size.xs,
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
});

export const tooltipDate = style({ color: color.text.muted });

export const tooltipRow = style({
  display: 'grid',
  gridTemplateColumns: '0.875rem auto 1fr',
  alignItems: 'center',
  gap: space[2],
});

export const tooltipKey = recipe({
  base: { height: '2px', borderRadius: '1px' },
  variants: {
    index: {
      0: { backgroundColor: seriesColor[0] },
      1: { backgroundColor: seriesColor[1] },
    },
  },
});

export const tooltipValue = style({
  color: color.text.strong,
  fontWeight: font.weight.semibold,
  fontVariantNumeric: 'tabular-nums',
});

export const tooltipLabel = style({ color: color.text.muted });
