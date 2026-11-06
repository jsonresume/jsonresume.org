import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { focusRing, onBrandVars } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { font, color, space } = vars;

export const logo = recipe({
  base: [
    focusRing,
    {
      display: 'inline-flex',
      alignItems: 'center',
      gap: space[2],
      // Inherit, so the wordmark is ink on the yellow header in both themes.
      color: 'inherit',
      fontFamily: font.family.wordmark,
      fontWeight: font.weight.bold,
      lineHeight: 1,
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      borderRadius: vars.radius.sm,
      // A comfortable tap target without changing how it looks.
      minHeight: '2.5rem',
    },
  ],
  variants: {
    size: {
      sm: { fontSize: font.size.sm },
      md: { fontSize: font.size.md },
      lg: { fontSize: font.size.xl },
    },
  },
  defaultVariants: { size: 'md' },
});

export const logoMark = style({
  width: '1.25em',
  height: '1.25em',
  flexShrink: 0,
});

export const pageHeaderActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[2],
});

/* PageHeader: the light gray title band at the top of inner pages. */
export const pageHeader = recipe({
  base: { paddingBlock: space[12] },
  variants: {
    tone: {
      subtle: { backgroundColor: color.surface.subtle },
      brand: {
        backgroundColor: color.surface.brand,
        color: color.text.onBrand,
        vars: onBrandVars,
      },
      page: { backgroundColor: color.surface.page },
    },
  },
  defaultVariants: { tone: 'subtle' },
});

export const pageHeaderInner = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: space[6],
});

export const pageHeaderText = style({
  display: 'grid',
  gap: space[3],
  minWidth: 0,
});

export const pageHeaderDescription = style({
  maxWidth: '60ch',
  color: color.text.muted,
  fontSize: font.size.md,
  lineHeight: font.lineHeight.normal,
});

export const eyebrow = style({
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

/* Feature: an icon-free, centered teaser column. */
export const feature = style({
  display: 'grid',
  justifyItems: 'center',
  alignContent: 'start',
  gap: space[3],
  textAlign: 'center',
});

export const featureText = style({
  maxWidth: '32ch',
  color: color.text.default,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
});

export const skipLink = style([
  focusRing,
  {
    position: 'absolute',
    insetInlineStart: space[4],
    insetBlockStart: space[4],
    zIndex: vars.zIndex.tooltip,
    padding: `${space[2]} ${space[4]}`,
    backgroundColor: color.surface.inverse,
    color: color.text.inverse,
    fontWeight: font.weight.semibold,
    borderRadius: vars.radius.md,
    textDecoration: 'none',
    transform: 'translateY(-200%)',
    selectors: { '&:focus': { transform: 'none' } },
  },
]);
