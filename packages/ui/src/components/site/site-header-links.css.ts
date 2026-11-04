import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { breakpoints, media } from '../../tokens/theme';
import { header } from './site-header.css';

const { font, color, space, motion } = vars;

const narrow = `screen and (max-width: ${breakpoints.lg - 0.02}px)`;
const rule = 'rgba(0, 0, 0, 0.12)';

const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(0.75rem)' },
  to: { opacity: 1, transform: 'none' },
});

/* In the menu: one large row per link, a rule between, an arrow that moves
   when touched. In the bar: a compact link, underlined when current. */
export const navLink = style([
  focusRing,
  {
    display: 'flex',
    alignItems: 'center',
    gap: space[3],
    paddingBlock: space[4],
    color: color.text.onBrand,
    fontSize: font.size.xl,
    fontWeight: font.weight.semibold,
    lineHeight: font.lineHeight.tight,
    textDecoration: 'none',
    borderBlockEnd: `1px solid ${rule}`,
    borderRadius: vars.radius.sm,
    WebkitTapHighlightColor: 'transparent',
    whiteSpace: 'nowrap',
    transition: `color ${transition}, padding ${transition}`,
    selectors: {
      '&:hover': { color: color.action.primaryHover },
      '&:active': { paddingInlineStart: space[2] },
    },
    '@media': {
      // Eight links share the bar from lg up: tighter until there is room.
      [media.lg]: {
        display: 'block',
        paddingBlock: space[6],
        paddingInline: space[2],
        fontSize: font.size.md,
        lineHeight: 'inherit',
        borderBlockEnd: 0,
        selectors: {
          '&:active': { paddingInlineStart: space[2] },
          '&[aria-current="page"]': {
            textDecoration: 'underline',
            textDecorationThickness: '2px',
            textUnderlineOffset: '6px',
          },
        },
      },
      [media.xl]: {
        paddingInline: space[3],
        selectors: { '&:active': { paddingInlineStart: space[3] } },
      },
    },
  },
]);

// A drawn chevron: CSS content would be read out as part of the link name.
globalStyle(`${navLink}::after`, {
  content: '""',
  width: '0.5rem',
  height: '0.5rem',
  marginInlineStart: 'auto',
  marginInlineEnd: space[2],
  borderBlockStart: '2px solid currentColor',
  borderInlineEnd: '2px solid currentColor',
  opacity: 0.45,
  transform: 'rotate(45deg)',
  transition: `transform ${transition}, opacity ${transition}`,
  '@media': { [media.lg]: { display: 'none' } },
});
globalStyle(`${navLink}:is(:hover, :active)::after`, {
  opacity: 1,
  transform: 'translateX(0.25rem) rotate(45deg)',
});

// The current page, in the menu: a red dot before its name.
globalStyle(`${navLink}[aria-current="page"]::before`, {
  content: '""',
  width: '0.5rem',
  height: '0.5rem',
  flexShrink: 0,
  borderRadius: vars.radius.full,
  backgroundColor: color.action.primary,
  '@media': { [media.lg]: { display: 'none' } },
});

/* Sign in and sign up: side by side and full width at the foot of the menu,
   small buttons in the bar. */
export const headerActions = style({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gap: space[3],
  '@media': {
    [media.lg]: { display: 'flex', alignItems: 'center', gap: space[2] },
  },
  selectors: {
    [`${header}[data-state="open"] &`]: {
      '@media': {
        [narrow]: {
          animation: `${rise} ${motion.duration.slow} ${motion.easing.out} 300ms both`,
        },
      },
    },
  },
});

globalStyle(`${headerActions} a`, {
  '@media': {
    [narrow]: {
      width: '100%',
      minHeight: '3rem',
      justifyContent: 'center',
      fontSize: font.size.xs,
    },
  },
});

// Of two actions, the first (sign in) gets an outline so it reads as a button.
globalStyle(`${headerActions} a:first-child:not(:only-child)`, {
  '@media': { [narrow]: { borderColor: 'currentColor' } },
});
