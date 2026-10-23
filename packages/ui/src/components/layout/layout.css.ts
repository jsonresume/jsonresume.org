import { createVar, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { onBrandVars } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

export const container = recipe({
  base: {
    width: '100%',
    marginInline: 'auto',
    paddingInline: vars.layout.gutterNarrow,
    '@media': { [media.sm]: { paddingInline: vars.layout.gutter } },
  },
  variants: {
    size: {
      default: {
        maxWidth: `calc(${vars.layout.container} + 2 * ${vars.layout.gutter})`,
      },
      wide: {
        maxWidth: `calc(${vars.layout.wide} + 2 * ${vars.layout.gutter})`,
      },
      prose: {
        maxWidth: `calc(${vars.layout.prose} + 2 * ${vars.layout.gutter})`,
      },
      full: { maxWidth: 'none' },
    },
  },
  defaultVariants: { size: 'default' },
});

export type ContainerVariants = NonNullable<RecipeVariants<typeof container>>;

/** Full-width bands, as on jsonresume.org: white, light gray, or brand yellow. */
export const section = recipe({
  variants: {
    tone: {
      page: { backgroundColor: vars.color.surface.page },
      subtle: { backgroundColor: vars.color.surface.subtle },
      brand: {
        backgroundColor: vars.color.surface.brand,
        color: vars.color.text.onBrand,
        vars: onBrandVars,
      },
      inverse: {
        backgroundColor: vars.color.surface.inverse,
        color: vars.color.text.inverse,
      },
    },
    spacing: {
      none: {},
      sm: { paddingBlock: vars.space[8] },
      md: { paddingBlock: vars.space[12] },
      lg: { paddingBlock: vars.space[16] },
      xl: { paddingBlock: `${vars.space[20]} ${vars.space[30]}` },
    },
  },
  defaultVariants: { tone: 'page', spacing: 'md' },
});

export type SectionVariants = NonNullable<RecipeVariants<typeof section>>;

const space = vars.space;
const gapValues = {
  0: space[0],
  1: space[1],
  2: space[2],
  3: space[3],
  4: space[4],
  5: space[5],
  6: space[6],
  8: space[8],
  10: space[10],
  12: space[12],
} as const;

const gapVariants = Object.fromEntries(
  Object.entries(gapValues).map(([k, v]) => [k, { gap: v }])
) as Record<keyof typeof gapValues, { gap: string }>;

export const stack = recipe({
  base: { display: 'flex', minWidth: 0 },
  variants: {
    direction: {
      column: { flexDirection: 'column' },
      row: { flexDirection: 'row' },
    },
    gap: gapVariants,
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
      baseline: { alignItems: 'baseline' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },
    wrap: { true: { flexWrap: 'wrap' } },
  },
  defaultVariants: { direction: 'column', gap: 4 },
});

export type StackVariants = NonNullable<RecipeVariants<typeof stack>>;

export const minColumn = createVar();

/** Responsive grid without breakpoints: as many columns as fit `minColumn`. */
export const grid = recipe({
  base: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(min(${minColumn}, 100%), 1fr))`,
    vars: { [minColumn]: '16rem' },
  },
  variants: { gap: gapVariants },
  defaultVariants: { gap: 6 },
});

export type GridVariants = NonNullable<RecipeVariants<typeof grid>>;

export const divider = recipe({
  base: {
    flexShrink: 0,
    border: 0,
    margin: 0,
    backgroundColor: vars.color.border.default,
  },
  variants: {
    orientation: {
      horizontal: { height: '1px', width: '100%' },
      vertical: { width: '1px', alignSelf: 'stretch' },
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export const visuallyHiddenFocusable = style({
  selectors: {
    '&:not(:focus):not(:focus-within)': {
      position: 'absolute',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      clipPath: 'inset(50%)',
      whiteSpace: 'nowrap',
    },
  },
});
