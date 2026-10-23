import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { breakpoints } from '../../tokens/theme';

const { color, font, space, radius, shadow, motion } = vars;

/** Below the md breakpoint split views stack. */
const narrow = `screen and (max-width: ${breakpoints.md - 1}px)`;

/* Panel */

export const panelHeight = createVar();

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  maxHeight: panelHeight,
  overflow: 'hidden',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.raised,
  vars: { [panelHeight]: 'none' },
});

export const panelHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[3],
  minHeight: '3rem',
  padding: `${space[2]} ${space[2]} ${space[2]} ${space[4]}`,
  borderBlockEnd: `1px solid ${color.border.subtle}`,
  backgroundColor: color.surface.subtle,
});

export const panelTitle = style({
  flex: 1,
  minWidth: 0,
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.sm,
  fontWeight: font.weight.semibold,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const panelActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[1],
});

export const panelBody = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: space[4],
});

export const panelFooter = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: space[2],
  padding: `${space[2]} ${space[4]}`,
  borderBlockStart: `1px solid ${color.border.subtle}`,
});

/* Toolbar */

export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[1],
  padding: space[1],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
});

export const toolbarButton = style([
  focusRing,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space[2],
    minHeight: '2rem',
    padding: `0 ${space[2]}`,
    border: 0,
    borderRadius: radius.sm,
    background: 'transparent',
    color: color.text.default,
    fontSize: font.size.sm,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `background-color ${transition}`,
    selectors: {
      '&:hover': { backgroundColor: color.surface.muted },
      '&[data-state="on"]': {
        backgroundColor: color.action.ink,
        color: color.action.inkText,
      },
      '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
    },
  },
]);

globalStyle(`${toolbarButton} svg`, {
  width: '1rem',
  height: '1rem',
  flexShrink: 0,
});

export const toolbarSeparator = style({
  width: '1px',
  alignSelf: 'stretch',
  marginInline: space[1],
  backgroundColor: color.border.subtle,
});

export const toolbarGroup = style({ display: 'inline-flex', gap: '2px' });

/* SplitView */

export const split = style({
  display: 'flex',
  minHeight: 0,
  height: '100%',
  '@media': { [narrow]: { flexDirection: 'column' } },
});

export const paneSize = createVar();

export const pane = style({
  flexBasis: paneSize,
  flexGrow: 0,
  flexShrink: 1,
  minWidth: 0,
  minHeight: 0,
  overflow: 'auto',
  '@media': { [narrow]: { flexBasis: 'auto' } },
});

export const separator = style({
  position: 'relative',
  flex: '0 0 9px',
  cursor: 'col-resize',
  touchAction: 'none',
  outline: 'none',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      insetBlock: 0,
      insetInlineStart: '4px',
      width: '1px',
      backgroundColor: color.border.default,
      transition: `background-color ${transition}, box-shadow ${transition}`,
    },
    '&:hover::after, &[data-dragging="true"]::after': {
      backgroundColor: color.action.ink,
      boxShadow: `0 0 0 1px ${color.action.ink}`,
    },
    '&:focus-visible::after': {
      backgroundColor: color.focus,
      boxShadow: `0 0 0 2px ${color.focus}`,
    },
  },
  '@media': { [narrow]: { display: 'none' } },
});

/* VirtualList */

export const viewportHeight = createVar();

export const virtualViewport = style({
  position: 'relative',
  height: viewportHeight,
  overflowY: 'auto',
  contain: 'strict',
});

export const virtualSizer = style({
  position: 'relative',
  width: '100%',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const virtualRow = style({
  position: 'absolute',
  insetInlineStart: 0,
  width: '100%',
});

/* Shortcuts help */

export const shortcutList = style({
  display: 'grid',
  gap: space[4],
  margin: 0,
});

export const shortcutGroup = style({ display: 'grid', gap: space[2] });

export const shortcutGroupTitle = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const shortcutRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: space[4],
  fontSize: font.size.sm,
});

export const keys = style({ display: 'inline-flex', gap: space[1] });

/* SwipeDeck */

export const deck = style({
  display: 'grid',
  justifyItems: 'center',
  gap: space[4],
  width: '100%',
});

export const deckStack = style({
  position: 'relative',
  width: 'min(22rem, 100%)',
  height: '26rem',
  outline: 'none',
});

export const dragX = createVar();
export const dragAngle = createVar();

export const deckCard = recipe({
  base: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: color.surface.raised,
    boxShadow: shadow.md,
    userSelect: 'none',
    touchAction: 'pan-y',
    vars: { [dragX]: '0px', [dragAngle]: '0deg' },
  },
  variants: {
    position: {
      top: {
        cursor: 'grab',
        transform: `translateX(${dragX}) rotate(${dragAngle})`,
        transition: `transform ${motion.duration.base} ${motion.easing.out}`,
        selectors: {
          '&[data-dragging="true"]': { transition: 'none', cursor: 'grabbing' },
        },
      },
      next: { transform: 'scale(0.96) translateY(10px)', opacity: 0.8 },
      hidden: { visibility: 'hidden' },
    },
  },
});

export const deckStamp = recipe({
  base: {
    position: 'absolute',
    insetBlockStart: space[4],
    padding: `${space[1]} ${space[3]}`,
    border: '2px solid',
    borderRadius: radius.md,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    letterSpacing: font.tracking.caps,
    textTransform: 'uppercase',
    opacity: 0,
    transition: `opacity ${motion.duration.fast}`,
  },
  variants: {
    side: {
      right: {
        insetInlineStart: space[4],
        color: color.status.success,
        transform: 'rotate(-12deg)',
      },
      left: {
        insetInlineEnd: space[4],
        color: color.status.danger,
        transform: 'rotate(12deg)',
      },
    },
    visible: { true: { opacity: 1 } },
  },
});

export const deckActions = style({ display: 'flex', gap: space[3] });

export const deckEmpty = style({
  display: 'grid',
  placeItems: 'center',
  height: '100%',
  border: `1px dashed ${color.border.default}`,
  borderRadius: radius.lg,
  color: color.text.muted,
  fontSize: font.size.sm,
  textAlign: 'center',
  padding: space[6],
});

/* Graph kit */

export const graphHeight = createVar();

export const graphRegion = style({
  position: 'relative',
  height: graphHeight,
  overflow: 'hidden',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.subtle,
});

export const graphOverlay = recipe({
  base: { position: 'absolute', zIndex: 1, display: 'flex', gap: space[2] },
  variants: {
    corner: {
      'top-start': { insetBlockStart: space[3], insetInlineStart: space[3] },
      'top-end': { insetBlockStart: space[3], insetInlineEnd: space[3] },
      'bottom-start': { insetBlockEnd: space[3], insetInlineStart: space[3] },
      'bottom-end': { insetBlockEnd: space[3], insetInlineEnd: space[3] },
    },
  },
});

export const graphControls = style({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
  boxShadow: shadow.sm,
});

export const graphControl = style([
  focusRing,
  {
    display: 'grid',
    placeItems: 'center',
    width: '2rem',
    height: '2rem',
    border: 0,
    background: 'transparent',
    color: color.text.default,
    cursor: 'pointer',
    selectors: {
      '&:hover': { backgroundColor: color.surface.muted },
      '& + &': { borderBlockStart: `1px solid ${color.border.subtle}` },
    },
  },
]);

export const legendColor = createVar();

export const graphLegend = style({
  display: 'grid',
  gap: space[1],
  margin: 0,
  padding: `${space[2]} ${space[3]}`,
  listStyle: 'none',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
  fontSize: font.size.xs,
  boxShadow: shadow.sm,
});

export const graphLegendItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[2],
});

export const graphLegendMark = recipe({
  base: {
    width: '0.75rem',
    height: '0.75rem',
    flexShrink: 0,
    backgroundColor: legendColor,
  },
  variants: {
    shape: {
      circle: { borderRadius: radius.full },
      square: { borderRadius: '2px' },
      line: { height: '2px' },
    },
  },
});

export const nodeCard = style({
  display: 'grid',
  gap: space[2],
  width: 'min(18rem, calc(100% - 1.5rem))',
  padding: space[4],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
  boxShadow: shadow.md,
  fontSize: font.size.sm,
});
