import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { color, font, space, radius, shadow, zIndex } = vars;

const fieldFrame = {
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.raised,
  color: color.text.default,
  transition: `border-color ${transition}, box-shadow ${transition}`,
  selectors: {
    '&:hover': { borderColor: color.border.strong },
    '&:focus-within': {
      borderColor: color.focus,
      boxShadow: `0 0 0 1px ${color.focus}`,
    },
  },
} as const;

const bareInput = {
  flex: 1,
  minWidth: 0,
  border: 0,
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
} as const;

// The frame shows focus (focus-within), so the inner input must not also
// draw the base focus ring.
const noInnerRing = { '&:focus-visible': { outline: 'none' } } as const;

const iconButton = style([
  focusRing,
  {
    display: 'inline-grid',
    placeItems: 'center',
    flexShrink: 0,
    width: '1.75rem',
    height: '1.75rem',
    border: 0,
    borderRadius: radius.md,
    background: 'transparent',
    color: color.text.muted,
    cursor: 'pointer',
    transition: `background-color ${transition}, color ${transition}`,
    selectors: {
      '&:hover': {
        backgroundColor: color.surface.muted,
        color: color.text.strong,
      },
    },
  },
]);

export { iconButton };

/* SearchField */

export const search = recipe({
  base: [
    fieldFrame,
    {
      display: 'flex',
      alignItems: 'center',
      gap: space[2],
      paddingInline: space[3],
    },
  ],
  variants: {
    size: {
      md: { minHeight: '2.5rem', fontSize: font.size.sm },
      lg: {
        minHeight: '3.75rem',
        fontSize: font.size.xl,
        paddingInline: space[5],
      },
    },
  },
  defaultVariants: { size: 'md' },
});

export const searchIcon = style({
  flexShrink: 0,
  width: '1.1em',
  height: '1.1em',
  color: color.text.muted,
});

export const searchInput = style({
  ...bareInput,
  paddingBlock: space[2],
  selectors: {
    ...noInnerRing,
    '&::placeholder': { color: color.text.muted, opacity: 1 },
    '&::-webkit-search-cancel-button': { display: 'none' },
  },
});

/* Chips: active filters and tags */

export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[1],
  maxWidth: '100%',
  minHeight: '1.75rem',
  paddingInlineStart: space[2],
  paddingInlineEnd: space[1],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.subtle,
  color: color.text.default,
  fontSize: font.size.xs,
  fontWeight: font.weight.semibold,
  lineHeight: 1,
});

export const chipLabel = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const chipRemove = style([
  iconButton,
  { width: '1.25rem', height: '1.25rem' },
]);

/* FilterBar */

export const filterBar = style({ display: 'grid', gap: space[3] });

export const filterControls = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: space[3],
});

export const filterSummary = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[2],
  color: color.text.muted,
  fontSize: font.size.xs,
});

export const chipList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

/* SegmentedControl */

export const segmented = style({
  display: 'inline-flex',
  padding: '2px',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.subtle,
  gap: '2px',
});

export const segment = style([
  focusRing,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space[2],
    minHeight: '2rem',
    padding: `0 ${space[3]}`,
    border: 0,
    borderRadius: radius.sm,
    background: 'transparent',
    color: color.text.muted,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    cursor: 'pointer',
    transition: `background-color ${transition}, color ${transition}`,
    selectors: {
      '&:hover': { color: color.text.strong },
      '&[data-state="checked"]': {
        backgroundColor: color.surface.raised,
        color: color.text.strong,
        boxShadow: shadow.sm,
      },
      '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
    },
  },
]);

globalStyle(`${segment} svg`, { width: '1em', height: '1em' });

/* TagInput */

export const tagInput = style([
  fieldFrame,
  {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space[2],
    minHeight: '2.5rem',
    padding: `${space[1]} ${space[2]}`,
    fontSize: font.size.sm,
    cursor: 'text',
  },
]);

export const tagInputField = style({
  ...bareInput,
  minWidth: '8rem',
  paddingBlock: space[1],
  selectors: noInnerRing,
});

/* RangeSlider */

export const sliderRoot = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '1.25rem',
  touchAction: 'none',
  userSelect: 'none',
});

export const sliderTrack = style({
  position: 'relative',
  flexGrow: 1,
  height: '4px',
  overflow: 'hidden',
  borderRadius: radius.full,
  backgroundColor: color.border.default,
});

export const sliderRange = style({
  position: 'absolute',
  height: '100%',
  backgroundColor: color.action.ink,
});

export const sliderThumb = style({
  display: 'block',
  width: '1.125rem',
  height: '1.125rem',
  border: `2px solid ${color.action.ink}`,
  borderRadius: radius.full,
  backgroundColor: color.surface.raised,
  boxShadow: shadow.sm,
  cursor: 'grab',
  transition: `box-shadow ${transition}`,
  selectors: {
    '&:hover': { boxShadow: `0 0 0 4px ${color.surface.muted}` },
    '&:focus-visible': {
      outline: `2px solid ${color.focus}`,
      outlineOffset: '2px',
    },
  },
});

export const sliderHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: space[3],
  fontSize: font.size.sm,
});

export const sliderValue = style({
  color: color.text.strong,
  fontWeight: font.weight.semibold,
  fontVariantNumeric: 'tabular-nums',
});

export const barHeight = createVar();

export const histogram = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '2px',
  height: '3rem',
  marginBlockEnd: space[1],
});

export const histogramBar = style({
  flex: 1,
  height: barHeight,
  minHeight: '2px',
  borderRadius: '1px 1px 0 0',
  backgroundColor: color.border.default,
  transition: `background-color ${transition}`,
  selectors: {
    '&[data-in-range="true"]': { backgroundColor: color.text.muted },
  },
});

/* Combobox */

export const combobox = style({ position: 'relative' });

export const comboboxControl = style([
  fieldFrame,
  {
    display: 'flex',
    alignItems: 'center',
    minHeight: '2.5rem',
    paddingInline: space[3],
    fontSize: font.size.sm,
  },
]);

export const comboboxInput = style({
  ...bareInput,
  paddingBlock: space[2],
  selectors: {
    ...noInnerRing,
    '&::placeholder': { color: color.text.muted, opacity: 1 },
  },
});

export const listbox = style({
  position: 'absolute',
  insetInline: 0,
  insetBlockStart: `calc(100% + ${space[1]})`,
  zIndex: zIndex.dropdown,
  maxHeight: '16rem',
  overflowY: 'auto',
  margin: 0,
  padding: space[1],
  listStyle: 'none',
  border: `1px solid ${color.border.subtle}`,
  borderRadius: radius.lg,
  backgroundColor: color.surface.raised,
  boxShadow: shadow.md,
  fontSize: font.size.sm,
});

export const option = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[2],
  padding: `${space[2]} ${space[3]}`,
  borderRadius: radius.md,
  cursor: 'pointer',
  selectors: {
    '&[data-active="true"]': {
      backgroundColor: color.surface.muted,
      color: color.text.strong,
    },
    '&[aria-selected="true"]': { fontWeight: font.weight.semibold },
  },
});

export const optionEmpty = style({
  padding: `${space[2]} ${space[3]}`,
  color: color.text.muted,
});

/* FileDropzone */

export const dropzone = style({
  display: 'grid',
  justifyItems: 'center',
  gap: space[2],
  padding: `${space[8]} ${space[6]}`,
  border: `2px dashed ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.subtle,
  textAlign: 'center',
  transition: `border-color ${transition}, background-color ${transition}`,
  selectors: {
    '&[data-dragging="true"]': {
      borderColor: color.action.ink,
      backgroundColor: color.surface.brandSubtle,
    },
    '&[data-invalid="true"]': { borderColor: color.status.danger },
  },
});

export const dropzoneIcon = style({
  width: '2rem',
  height: '2rem',
  color: color.text.muted,
});

export const dropzoneTitle = style({
  margin: 0,
  color: color.text.strong,
  fontWeight: font.weight.semibold,
});

export const dropzoneHint = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.xs,
});

export const fileList = style({
  display: 'grid',
  gap: space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const fileItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[3],
  padding: `${space[2]} ${space[3]}`,
  border: `1px solid ${color.border.subtle}`,
  borderRadius: radius.sm,
  fontSize: font.size.sm,
});

export const fileName = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const fileSize = style({
  color: color.text.muted,
  fontSize: font.size.xs,
  fontVariantNumeric: 'tabular-nums',
});

/* Repeater */

export const repeater = style({ display: 'grid', gap: space[4] });

export const repeaterItem = style({
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.raised,
});

export const repeaterHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[2],
  padding: `${space[2]} ${space[2]} ${space[2]} ${space[4]}`,
  borderBlockEnd: `1px solid ${color.border.subtle}`,
  backgroundColor: color.surface.subtle,
});

export const repeaterTitle = style({
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

export const repeaterBody = style({
  display: 'grid',
  gap: space[4],
  padding: space[4],
});

/* ChatComposer */

export const composer = style([
  fieldFrame,
  {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'end',
    gap: space[2],
    padding: space[2],
  },
]);

export const composerInput = style({
  ...bareInput,
  resize: 'none',
  padding: `${space[1]} ${space[2]}`,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
  maxHeight: '12rem',
  overflowY: 'auto',
  selectors: {
    ...noInnerRing,
    '&::placeholder': { color: color.text.muted, opacity: 1 },
  },
});

export const composerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[1],
});

export const composerHint = style({
  gridColumn: '1 / -1',
  paddingInline: space[2],
  color: color.text.muted,
  fontSize: font.size.xs,
});

/* CodeEditor */

export const codeEditor = style([
  fieldFrame,
  {
    overflow: 'hidden',
    fontSize: font.size.xs,
    selectors: {
      '&[data-invalid="true"]': { borderColor: color.status.danger },
    },
  },
]);

export const codeStatus = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[2],
  padding: `${space[1]} ${space[3]}`,
  borderBlockStart: `1px solid ${color.border.subtle}`,
  backgroundColor: color.surface.subtle,
  color: color.text.muted,
  fontSize: font.size.xs,
  selectors: { '&[data-invalid="true"]': { color: color.status.danger } },
});
