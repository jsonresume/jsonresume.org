import { style } from '@vanilla-extract/css';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { color, font, space, radius } = vars;

/* TabNav: page-level tabs that are links. */

export const tabNav = style({
  display: 'flex',
  gap: space[1],
  margin: 0,
  padding: 0,
  overflowX: 'auto',
  listStyle: 'none',
  borderBlockEnd: `1px solid ${color.border.default}`,
});

export const tabLink = style([
  focusRing,
  {
    display: 'block',
    marginBlockEnd: '-1px',
    padding: `${space[3]} ${space[4]}`,
    borderBlockEnd: '2px solid transparent',
    color: color.text.muted,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: `color ${transition}, border-color ${transition}`,
    selectors: {
      '&:hover': { color: color.text.strong },
      '&[aria-current="page"]': {
        color: color.text.strong,
        borderBlockEndColor: color.action.primary,
      },
    },
  },
]);

/* Pagination */

/** Measures itself, so the page list fits wherever it is placed. */
export const paginationNav = style({ containerType: 'inline-size' });

export const pagination = style({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  gap: space[1],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const pageItem = style([
  focusRing,
  {
    display: 'inline-grid',
    placeItems: 'center',
    minWidth: '2.25rem',
    height: '2.25rem',
    paddingInline: space[2],
    border: '1px solid transparent',
    borderRadius: radius.md,
    background: 'transparent',
    color: color.text.default,
    fontSize: font.size.sm,
    fontVariantNumeric: 'tabular-nums',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `background-color ${transition}, border-color ${transition}`,
    selectors: {
      '&:hover': { backgroundColor: color.surface.muted },
      '&[aria-current="page"]': {
        borderColor: color.action.ink,
        backgroundColor: color.action.ink,
        color: color.action.inkText,
      },
      '&[aria-disabled="true"]': { opacity: 0.4, pointerEvents: 'none' },
    },
  },
]);

/** Every nearby page, where there is room for it. */
export const pagesWide = style({
  '@container': { '(max-width: 22rem)': { display: 'none' } },
});
/** Just the current page between the first and last, where there isn't. */
export const pagesNarrow = style({
  '@container': { '(min-width: 22.01rem)': { display: 'none' } },
});

export const pageGap = style({
  minWidth: '1.5rem',
  textAlign: 'center',
  color: color.text.muted,
});

export const loadMore = style({
  display: 'grid',
  justifyItems: 'center',
  gap: space[2],
});

export const loadMoreStatus = style({
  color: color.text.muted,
  fontSize: font.size.xs,
});

/* BackLink */

export const backLink = style([
  focusRing,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space[1],
    color: color.text.muted,
    fontSize: font.size.sm,
    textDecoration: 'none',
    borderRadius: radius.sm,
    transition: `color ${transition}`,
    selectors: { '&:hover': { color: color.text.strong } },
  },
]);

/* AccountMenu */

export const accountTrigger = style([
  focusRing,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space[2],
    padding: space[1],
    paddingInlineEnd: space[2],
    border: 0,
    borderRadius: radius.md,
    background: 'transparent',
    color: 'inherit',
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    cursor: 'pointer',
    transition: `background-color ${transition}`,
    selectors: {
      '&:hover, &[data-state="open"]': {
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
      },
    },
  },
]);

export const accountHeader = style({
  display: 'grid',
  padding: `${space[2]} ${space[3]}`,
  lineHeight: font.lineHeight.snug,
});

/** A long username ends in an ellipsis instead of wrapping the top bar. */
export const accountTriggerName = style({
  maxWidth: '8rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '@media': { [media.md]: { maxWidth: '14rem' } },
});

export const accountName = style({
  color: color.text.strong,
  fontWeight: font.weight.semibold,
});
export const accountEmail = style({
  color: color.text.muted,
  overflowWrap: 'anywhere',
  fontSize: font.size.xs,
});
