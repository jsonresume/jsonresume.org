import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/contract.css';

const { color, font, space, radius, motion } = vars;

/* Activity feed and timeline */

export const feed = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'grid',
});

export const feedItem = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: `2px ${space[3]}`,
  paddingBlock: space[3],
  selectors: {
    '& + &': { borderBlockStart: `1px solid ${color.border.subtle}` },
  },
});

export const feedIcon = style({
  gridRow: '1 / span 2',
  display: 'grid',
  placeItems: 'center',
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: radius.full,
  backgroundColor: color.surface.muted,
  color: color.text.muted,
});

export const feedTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.sm,
});

export const feedText = style({
  gridColumn: 2,
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.xs,
});

export const feedTime = style({
  gridColumn: 3,
  gridRow: 1,
  color: color.text.muted,
  fontSize: font.size.xs,
  whiteSpace: 'nowrap',
});

export const timeline = style({
  position: 'relative',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const timelineItem = style({
  position: 'relative',
  display: 'grid',
  gap: space[1],
  paddingInlineStart: space[8],
  paddingBlockEnd: space[6],
  selectors: {
    // The rail.
    '&::before': {
      content: '""',
      position: 'absolute',
      insetInlineStart: '0.4375rem',
      insetBlock: '1.1rem 0',
      width: '2px',
      backgroundColor: color.border.default,
    },
    '&:last-child::before': { display: 'none' },
    '&:last-child': { paddingBlockEnd: 0 },
  },
});

export const timelineDot = recipe({
  base: {
    position: 'absolute',
    insetInlineStart: 0,
    insetBlockStart: '0.3rem',
    width: '1rem',
    height: '1rem',
    borderRadius: radius.full,
    border: `2px solid ${color.action.ink}`,
    backgroundColor: color.surface.page,
  },
  variants: { current: { true: { backgroundColor: color.surface.brand } } },
});

export const timelineDate = style({
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const timelineTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.md,
  fontWeight: font.weight.semibold,
});

export const timelineSubtitle = style({
  margin: 0,
  color: color.text.default,
  fontSize: font.size.sm,
});

export const timelineText = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
  maxWidth: vars.layout.prose,
});

/* Charts */

export const chart = style({ display: 'grid', gap: space[2], margin: 0 });

export const chartTitle = style({
  color: color.text.strong,
  fontSize: font.size.sm,
  fontWeight: font.weight.semibold,
});

export const svg = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  overflow: 'visible',
});

export const axis = style({ stroke: color.border.default, strokeWidth: 1 });

export const grid = style({ stroke: color.border.subtle, strokeWidth: 1 });

export const tick = style({
  fill: color.text.muted,
  fontSize: '9.5px',
  fontFamily: font.family.sans,
});

export const barRect = style({
  fill: color.action.ink,
  transition: `opacity ${motion.duration.base} ${motion.easing.standard}`,
  selectors: { '&:hover': { opacity: 0.8 } },
});

export const barHighlight = style({ fill: color.action.primary });

export const lineSeries = recipe({
  base: {
    fill: 'none',
    strokeWidth: 2,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
  },
  variants: {
    index: {
      0: { stroke: color.action.ink },
      1: { stroke: color.action.primary },
      2: { stroke: color.status.info },
      3: { stroke: color.status.success },
    },
  },
});

export const lineDot = recipe({
  base: { strokeWidth: 2, fill: color.surface.page },
  variants: {
    index: {
      0: { stroke: color.action.ink },
      1: { stroke: color.action.primary },
      2: { stroke: color.status.info },
      3: { stroke: color.status.success },
    },
  },
});

export const radarArea = style({
  fill: color.surface.brand,
  fillOpacity: 0.6,
  stroke: color.action.ink,
  strokeWidth: 2,
});

export const legend = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space[1]} ${space[4]}`,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  fontSize: font.size.xs,
  color: color.text.default,
});

export const legendItem = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[2],
});

export const swatchColor = createVar();

export const legendSwatch = style({
  width: '0.625rem',
  height: '0.625rem',
  borderRadius: '2px',
  backgroundColor: swatchColor,
});

export const legendLine = style({
  width: '0.875rem',
  height: '2px',
  borderRadius: '1px',
  backgroundColor: swatchColor,
});

export const dataToggle = style({
  fontSize: font.size.xs,
  color: color.text.muted,
});

/* Calendar heatmap: the data scale */

export const heatmapWidth = createVar();

export const heatmap = style({ margin: 0 });

export const heatmapSvg = style({
  display: 'block',
  width: '100%',
  maxWidth: heatmapWidth,
});

export const heatCell = recipe({
  base: { rx: 2, ry: 2, stroke: color.border.subtle, strokeWidth: 1 },
  variants: {
    level: {
      0: { fill: color.surface.subtle },
      1: { fill: color.data.step1 },
      2: { fill: color.data.step2 },
      3: { fill: color.data.step3 },
      4: { fill: color.data.step4 },
    },
  },
});

/* PreviewFrame */

export const scale = createVar();
export const frameHeight = createVar();

export const previewViewport = style({
  position: 'relative',
  overflow: 'hidden',
  height: frameHeight,
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.muted,
});

export const previewFill = style({ height: '100%', minHeight: '20rem' });

// While a new render is on its way, the last one stays, dimmed.
export const previewBusy = style({
  opacity: 0.6,
  transition: `opacity ${vars.motion.duration.base}`,
});

export const previewStatus = style({
  position: 'absolute',
  insetBlockStart: vars.space[2],
  insetInlineEnd: vars.space[2],
  zIndex: 1,
});

// Centered, scaled down to fit (never up), from the top edge.
export const previewFrame = style({
  position: 'absolute',
  insetBlockStart: 0,
  left: '50%',
  border: 0,
  backgroundColor: '#ffffff',
  transform: `translateX(-50%) scale(${scale})`,
  transformOrigin: '50% 0',
});
