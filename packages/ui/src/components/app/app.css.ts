import { style } from '@vanilla-extract/css';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { color, font, space, radius, zIndex } = vars;

/* AppShell: sidebar from lg up, a top bar with a menu button below it. */

export const shell = style({
  display: 'grid',
  minHeight: '100dvh',
  backgroundColor: color.surface.page,
  '@media': { [media.lg]: { gridTemplateColumns: '15rem minmax(0, 1fr)' } },
});

export const sidebar = style({
  display: 'none',
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

export const sheetPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space[6],
  height: '100%',
});

export const sidebarNav = style({ flex: 1 });

export const sidebarFooter = style({
  paddingBlockStart: space[4],
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
  '@media': { [media.lg]: { paddingInline: space[8] } },
});

export const topbarBrand = style({
  '@media': { [media.lg]: { display: 'none' } },
});

export const topbarEnd = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[3],
  marginInlineStart: 'auto',
});

export const menuButton = style([
  focusRing,
  {
    display: 'inline-grid',
    placeItems: 'center',
    width: '2.25rem',
    height: '2.25rem',
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
    transition: `background-color ${transition}`,
    selectors: {
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
