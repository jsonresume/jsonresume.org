import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { color, font, space, radius, shadow, motion, zIndex } = vars;

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const pop = keyframes({
  from: { opacity: 0, transform: 'scale(0.97)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

/** Floating surface shared by menus and popovers. */
export const surface = style({
  zIndex: zIndex.dropdown,
  minWidth: '12rem',
  maxWidth: 'min(22rem, calc(100vw - 2rem))',
  padding: space[1],
  border: `1px solid ${color.border.subtle}`,
  borderRadius: radius.lg,
  backgroundColor: color.surface.raised,
  color: color.text.default,
  boxShadow: shadow.md,
  fontSize: font.size.sm,
  transformOrigin:
    'var(--radix-dropdown-menu-content-transform-origin, var(--radix-popover-content-transform-origin))',
  animation: `${pop} ${motion.duration.fast} ${motion.easing.out}`,
  selectors: { '&:focus': { outline: 'none' } },
});

export const popover = style([surface, { padding: space[4] }]);

export const arrow = style({ fill: color.surface.raised });

/* Menu items */

export const menuItem = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: space[2],
    minHeight: '2rem',
    padding: `${space[1]} ${space[3]}`,
    paddingInlineStart: space[3],
    borderRadius: radius.md,
    color: color.text.default,
    lineHeight: font.lineHeight.snug,
    cursor: 'pointer',
    userSelect: 'none',
    outline: 'none',
    selectors: {
      '&[data-highlighted]': {
        backgroundColor: color.surface.muted,
        color: color.text.strong,
      },
      '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
    },
  },
  variants: {
    tone: {
      default: {},
      danger: {
        color: color.status.danger,
        selectors: {
          '&[data-highlighted]': {
            backgroundColor: color.status.dangerSurface,
            color: color.status.danger,
          },
        },
      },
    },
    inset: { true: { paddingInlineStart: space[8] } },
  },
  defaultVariants: { tone: 'default' },
});

export const menuItemIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1rem',
  height: '1rem',
  flexShrink: 0,
  color: color.text.muted,
});

globalStyle(`${menuItemIcon} svg`, { width: '100%', height: '100%' });

export const menuShortcut = style({
  marginInlineStart: 'auto',
  paddingInlineStart: space[4],
  color: color.text.muted,
  fontSize: font.size.xs,
});

export const menuIndicator = style({
  position: 'absolute',
  insetInlineStart: space[2],
  display: 'inline-flex',
  width: '1rem',
  justifyContent: 'center',
});

export const menuLabel = style({
  padding: `${space[2]} ${space[3]} ${space[1]}`,
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const menuSeparator = style({
  height: '1px',
  marginBlock: space[1],
  marginInline: `calc(-1 * ${space[1]})`,
  backgroundColor: color.border.subtle,
});

/* Sheet: a panel that slides over the page. */

const slideIn = {
  right: keyframes({
    from: { transform: 'translateX(100%)' },
    to: { transform: 'none' },
  }),
  left: keyframes({
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'none' },
  }),
  bottom: keyframes({
    from: { transform: 'translateY(100%)' },
    to: { transform: 'none' },
  }),
};

export const sheetOverlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: zIndex.overlay,
  backgroundColor: color.overlay,
  animation: `${fadeIn} ${motion.duration.base} ${motion.easing.out}`,
});

export const sheet = recipe({
  base: {
    position: 'fixed',
    zIndex: zIndex.modal,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: color.surface.raised,
    color: color.text.default,
    boxShadow: shadow.lg,
    animationDuration: motion.duration.slow,
    animationTimingFunction: motion.easing.out,
    selectors: { '&:focus': { outline: 'none' } },
  },
  variants: {
    side: {
      right: {
        insetBlock: 0,
        insetInlineEnd: 0,
        width: 'min(28rem, 100vw)',
        animationName: slideIn.right,
        borderInlineStart: `1px solid ${color.border.subtle}`,
      },
      left: {
        insetBlock: 0,
        insetInlineStart: 0,
        width: 'min(28rem, 100vw)',
        animationName: slideIn.left,
        borderInlineEnd: `1px solid ${color.border.subtle}`,
      },
      bottom: {
        insetInline: 0,
        insetBlockEnd: 0,
        maxHeight: '85vh',
        animationName: slideIn.bottom,
        borderStartStartRadius: radius.lg,
        borderStartEndRadius: radius.lg,
      },
    },
  },
  defaultVariants: { side: 'right' },
});

export const sheetHeader = style({
  display: 'grid',
  gap: space[1],
  padding: `${space[5]} ${space[12]} ${space[4]} ${space[6]}`,
  borderBlockEnd: `1px solid ${color.border.subtle}`,
});

export const sheetBody = style({
  flex: 1,
  overflowY: 'auto',
  padding: space[6],
});

export const sheetFooter = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: space[2],
  padding: `${space[4]} ${space[6]}`,
  borderBlockStart: `1px solid ${color.border.subtle}`,
});

export const sheetTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.xl,
  fontWeight: font.weight.regular,
  lineHeight: font.lineHeight.tight,
});

export const sheetDescription = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const closeButton = style([
  focusRing,
  {
    position: 'absolute',
    insetBlockStart: space[4],
    insetInlineEnd: space[4],
    display: 'grid',
    placeItems: 'center',
    width: '2rem',
    height: '2rem',
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

/* Toast */

const toastIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'none' },
});
const toastOut = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });

export const toastViewport = style({
  position: 'fixed',
  insetBlockEnd: 0,
  insetInlineEnd: 0,
  zIndex: zIndex.toast,
  display: 'flex',
  flexDirection: 'column',
  gap: space[2],
  width: 'min(24rem, 100vw)',
  maxHeight: '100vh',
  margin: 0,
  padding: space[4],
  listStyle: 'none',
  outline: 'none',
});

export const toast = recipe({
  base: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'start',
    gap: `${space[1]} ${space[3]}`,
    padding: space[4],
    border: `1px solid ${color.border.subtle}`,
    borderInlineStart: '3px solid',
    borderRadius: radius.md,
    backgroundColor: color.surface.raised,
    color: color.text.default,
    boxShadow: shadow.lg,
    fontSize: font.size.sm,
    animation: `${toastIn} ${motion.duration.base} ${motion.easing.out}`,
    selectors: {
      '&[data-state="closed"]': {
        animation: `${toastOut} ${motion.duration.fast} ${motion.easing.standard}`,
      },
      '&[data-swipe="move"]': {
        transform: 'translateX(var(--radix-toast-swipe-move-x))',
      },
      '&[data-swipe="end"]': {
        transform: 'translateX(var(--radix-toast-swipe-end-x))',
      },
    },
  },
  variants: {
    tone: {
      neutral: { borderInlineStartColor: color.text.strong },
      success: { borderInlineStartColor: color.status.success },
      danger: { borderInlineStartColor: color.status.danger },
      info: { borderInlineStartColor: color.status.info },
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export const toastTitle = style({
  gridColumn: 1,
  margin: 0,
  color: color.text.strong,
  fontWeight: font.weight.semibold,
});
export const toastDescription = style({
  gridColumn: 1,
  margin: 0,
  color: color.text.muted,
});
export const toastAction = style({
  gridColumn: 1,
  marginBlockStart: space[2],
  justifySelf: 'start',
});
export const toastClose = style([
  closeButton,
  {
    position: 'static',
    gridColumn: 2,
    gridRow: '1 / span 3',
    width: '1.75rem',
    height: '1.75rem',
  },
]);
