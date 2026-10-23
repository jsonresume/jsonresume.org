import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { focusRing, onBrandVars, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

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

/* SiteHeader: the yellow navigation band. */
export const header = style({
  position: 'relative',
  backgroundColor: color.surface.brand,
  color: color.text.onBrand,
  vars: onBrandVars,
});

export const headerInner = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  minHeight: '4.25rem',
  columnGap: space[6],
});

export const headerBrand = style({
  marginInlineEnd: 'auto',
  paddingBlock: space[4],
});

export const navToggle = style([
  focusRing,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    border: 0,
    borderRadius: vars.radius.md,
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    '@media': { [media.md]: { display: 'none' } },
    selectors: { '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.06)' } },
  },
]);

/* Navigation and actions share one region: collapsible on small screens,
   inline on wide ones. DOM order matches visual order at every width. */
export const navRegion = style({
  display: 'none',
  flexBasis: '100%',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space[3],
  paddingBlockEnd: space[4],
  selectors: { '&[data-open="true"]': { display: 'flex' } },
  '@media': {
    [media.md]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexBasis: 'auto',
      gap: space[4],
      paddingBlockEnd: 0,
    },
  },
});

export const nav = style({ alignSelf: 'stretch' });

export const navList = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '@media': { [media.md]: { flexDirection: 'row', alignItems: 'center' } },
});

export const navLink = style([
  focusRing,
  {
    display: 'block',
    padding: `${space[3]} ${space[3]}`,
    color: color.text.onBrand,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    textDecoration: 'none',
    borderRadius: vars.radius.sm,
    transition: `color ${transition}`,
    selectors: {
      '&:hover': { color: color.action.primaryHover },
      '&[aria-current="page"]': {
        textDecoration: 'underline',
        textDecorationThickness: '2px',
        textUnderlineOffset: '6px',
      },
    },
    '@media': { [media.md]: { paddingBlock: space[6] } },
  },
]);

export const headerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[2],
});

export const pageHeaderActions = style({
  display: 'flex',
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

/* SiteFooter: small, centered, uppercase links. */
export const footer = style({
  paddingBlock: space[12],
  borderBlockStart: `1px solid ${color.border.subtle}`,
  textAlign: 'center',
  color: color.text.muted,
  fontSize: font.size['2xs'],
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const footerLinks = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: `${space[2]} ${space[4]}`,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

globalStyle(`${footer} a`, {
  color: color.text.muted,
  textDecoration: 'none',
  transition: `color ${transition}`,
});
globalStyle(`${footer} a:hover`, { color: color.text.strong });

export const footerNote = style({ marginBlockStart: space[4] });

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
