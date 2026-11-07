import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { breakpoints, media } from '../../tokens/theme';

const { color, font, space, radius, zIndex, motion } = vars;
const phone = `screen and (max-width: ${breakpoints.sm - 0.02}px)`;

const rise = keyframes({
  from: { opacity: 0, transform: 'translateX(-0.5rem)' },
  to: { opacity: 1, transform: 'none' },
});

/* AppShell: sidebar from lg up, a top bar with a menu button below it. */

export const shell = style({
  display: 'grid',
  minHeight: '100dvh',
  backgroundColor: color.surface.page,
  '@media': { [media.lg]: { gridTemplateColumns: '15rem minmax(0, 1fr)' } },
});

export const sidebar = style({
  display: 'none',
  viewTransitionName: 'app-sidebar',
  '@media': {
    [media.lg]: {
      position: 'sticky',
      insetBlockStart: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: space[6],
      // The viewport when it is the page; the shell's height when embedded.
      alignSelf: 'start',
      height: '100%',
      maxHeight: '100dvh',
      padding: `${space[5]} ${space[4]}`,
      borderInlineEnd: `1px solid ${color.border.subtle}`,
      backgroundColor: color.surface.subtle,
      overflowY: 'auto',
    },
  },
});

/** The navigation sheet: narrower than a form sheet, so the page shows. */
export const sheet = style({ width: 'min(20rem, 86vw)' });

export const sheetPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[6],
  height: '100%',
  overflowY: 'auto',
  // The brand's row lines up with the sheet's close button.
  padding: `${space[3]} ${space[3]} max(${space[4]}, env(safe-area-inset-bottom))`,
});

export const sheetBrand = style({
  display: 'flex',
  alignItems: 'center',
  minHeight: '2.5rem',
  paddingInline: `${space[3]} ${space[12]}`,
});

// In the sheet: rows a thumb can hit, arriving one after another.
globalStyle(`${sheetPanel} li`, {
  animation: `${rise} ${motion.duration.slow} ${motion.easing.out} both`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});
for (let n = 1; n <= 10; n++)
  globalStyle(`${sheetPanel} li:nth-child(${n})`, {
    animationDelay: `${40 + n * 25}ms`,
  });

export const sidebarNav = style({ flex: 1 });

export const sidebarFooter = style({
  paddingBlockStart: space[4],
  paddingInline: space[3],
  borderBlockStart: `1px solid ${color.border.subtle}`,
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

export const topbar = style({
  position: 'sticky',
  insetBlockStart: 0,
  zIndex: zIndex.sticky,
  display: 'flex',
  alignItems: 'center',
  gap: space[3],
  minHeight: '3.5rem',
  paddingInline: space[4],
  borderBlockEnd: `1px solid ${color.border.subtle}`,
  backgroundColor: color.surface.page,
  viewTransitionName: 'app-topbar',
  '@media': { [media.lg]: { paddingInline: space[8] } },
});

// The brand gives way first, so the menu button and account stay whole.
export const topbarBrand = style({
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  '@media': { [media.lg]: { display: 'none' } },
});

export const topbarEnd = style({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: space[3],
  marginInlineStart: 'auto',
  '@media': { [phone]: { gap: space[1] } },
});

export const menuButton = style([
  focusRing,
  {
    display: 'inline-grid',
    flexShrink: 0,
    placeItems: 'center',
    // A thumb-sized target; the button only shows below lg.
    width: '2.75rem',
    height: '2.75rem',
    padding: 0,
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.md,
    backgroundColor: color.surface.raised,
    color: color.text.strong,
    cursor: 'pointer',
    '@media': { [media.lg]: { display: 'none' } },
  },
]);

export const main = style({
  flex: 1,
  padding: `${space[6]} ${space[4]} ${space[12]}`,
  outline: 'none',
  '@media': { [media.lg]: { padding: `${space[8]} ${space[8]} ${space[16]}` } },
});

/* AppNav */

export const navList = style({
  display: 'grid',
  gap: '2px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const navLink = style([
  focusRing,
  {
    display: 'flex',
    alignItems: 'center',
    gap: space[3],
    padding: `${space[2]} ${space[3]}`,
    borderRadius: radius.md,
    color: color.text.default,
    fontSize: font.size.sm,
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
    transition: `background-color ${transition}, box-shadow ${transition}`,
    '@media': {
      [media.coarse]: { minHeight: '2.75rem', fontSize: font.size.md },
    },
    selectors: {
      '&:active': { backgroundColor: color.surface.muted },
      '&:hover': {
        backgroundColor: color.surface.muted,
        color: color.text.strong,
      },
      '&[aria-current="page"]': {
        backgroundColor: color.surface.muted,
        color: color.text.strong,
        fontWeight: font.weight.semibold,
        boxShadow: `inset 3px 0 0 ${color.action.primary}`,
      },
    },
  },
]);

export const navIcon = style({
  display: 'inline-grid',
  placeItems: 'center',
  width: '1.125rem',
  color: color.text.muted,
  selectors: {
    [`${navLink}[aria-current="page"] &`]: { color: color.text.strong },
  },
});
